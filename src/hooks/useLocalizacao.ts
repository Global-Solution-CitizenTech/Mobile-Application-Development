import { useCallback, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import type { LocalizacaoCapturada } from '@/types/endereco';
import { onlyDigits } from '@/utils/formatters';

const GPS_TIMEOUT_MS = 15000;

export function formatLocalizacaoResumo(loc: LocalizacaoCapturada | null): string | null {
  if (!loc) return null;
  return [loc.bairro, loc.cidade].filter(Boolean).join(' • ') || 'Localização capturada';
}

function getLocationErrorMessage(error: unknown, phase: 'position' | 'geocode'): string {
  const message = error instanceof Error ? error.message.toLowerCase() : '';
  if (message.includes('timeout') || message.includes('timed out')) {
    return 'Tempo esgotado ao buscar sinal de GPS. Tente novamente ou preencha o endereço manualmente.';
  }
  if (message.includes('permission') || message.includes('denied')) {
    return 'Permissão de localização negada. Preencha o endereço manualmente.';
  }
  if (message.includes('disabled') || message.includes('unavailable') || message.includes('provider')) {
    return 'Serviços de localização indisponíveis no momento. Verifique o GPS do dispositivo.';
  }
  if (phase === 'geocode') {
    return 'Localização obtida, mas não foi possível converter em endereço. Preencha manualmente.';
  }
  return 'Não foi possível obter sua localização pelo GPS.';
}

async function getCurrentPositionWithTimeout(): Promise<Location.LocationObject> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('GPS request timeout')), GPS_TIMEOUT_MS);
      }),
    ]);
  } finally {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
  }
}

export function useLocalizacao() {
  const [capturandoGps, setCapturandoGps] = useState(false);
  const [erroGps, setErroGps] = useState<string | null>(null);
  const [ultimaLocalizacao, setUltimaLocalizacao] = useState<LocalizacaoCapturada | null>(null);
  const mountedRef = useRef(true);
  const requestIdRef = useRef(0);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const capturarLocalizacao = useCallback(async (): Promise<LocalizacaoCapturada | null> => {
    const requestId = ++requestIdRef.current;
    const isActive = () => mountedRef.current && requestId === requestIdRef.current;

    setCapturandoGps(true);
    setErroGps(null);

    try {
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!isActive()) return null;
      if (!servicesEnabled) {
        setErroGps('GPS desativado. Ative os serviços de localização do dispositivo ou preencha manualmente.');
        return null;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (!isActive()) return null;
      if (status !== 'granted') {
        setErroGps('Permissão de localização negada. Preencha o endereço manualmente.');
        return null;
      }

      let position: Location.LocationObject;
      try {
        position = await getCurrentPositionWithTimeout();
      } catch (err) {
        if (isActive()) {
          setErroGps(getLocationErrorMessage(err, 'position'));
        }
        return null;
      }

      if (!isActive()) return null;

      let geocodes: Location.LocationGeocodedAddress[];
      try {
        geocodes = await Location.reverseGeocodeAsync(position.coords);
      } catch (err) {
        if (isActive()) {
          setErroGps(getLocationErrorMessage(err, 'geocode'));
        }
        return null;
      }

      if (!isActive()) return null;

      const geo = geocodes[0];
      const bairro = (geo?.district || geo?.subregion || '').trim();
      const cidade = (geo?.city || geo?.region || '').trim();
      const referencia = (bairro ? `Bairro ${bairro}` : geo?.name || '').trim().slice(0, 50);

      const resultado: LocalizacaoCapturada = {
        cep: onlyDigits(geo?.postalCode).slice(0, 8),
        rua: (geo?.street || '').trim().slice(0, 100),
        numero: (geo?.streetNumber || '').trim().slice(0, 100),
        referencia,
        bairro,
        cidade,
      };

      setUltimaLocalizacao(resultado);
      return resultado;
    } catch (err) {
      if (isActive()) {
        setErroGps(getLocationErrorMessage(err, 'position'));
      }
      return null;
    } finally {
      if (isActive()) {
        setCapturandoGps(false);
      }
    }
  }, []);

  const limparLocalizacao = useCallback(() => {
    requestIdRef.current += 1;
    setCapturandoGps(false);
    setUltimaLocalizacao(null);
    setErroGps(null);
  }, []);

  return {
    capturandoGps,
    erroGps,
    ultimaLocalizacao,
    localizacaoResumo: formatLocalizacaoResumo(ultimaLocalizacao),
    capturarLocalizacao,
    limparLocalizacao,
  };
}
