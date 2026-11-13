import { useCallback, useState } from 'react';
import * as Location from 'expo-location';
import type { LocalizacaoCapturada } from '@/types/endereco';
import { onlyDigits } from '@/utils/formatters';

export function useLocalizacao() {
  const [capturandoGps, setCapturandoGps] = useState(false);
  const [erroGps, setErroGps] = useState<string | null>(null);
  const [ultimaLocalizacao, setUltimaLocalizacao] = useState<LocalizacaoCapturada | null>(null);

  const capturarLocalizacao = useCallback(async (): Promise<LocalizacaoCapturada | null> => {
    setCapturandoGps(true);
    setErroGps(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErroGps('Permissão de localização negada. Preencha o endereço manualmente.');
        return null;
      }

      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const geocodes = await Location.reverseGeocodeAsync(position.coords);
      const geo = geocodes[0];

      const bairro = (geo?.district || geo?.subregion || '').trim();
      const cidade = (geo?.city || geo?.region || '').trim();
      const referencia = (bairro ? `Bairro ${bairro}` : geo?.name || '').trim().slice(0, 50);

      const resultado: LocalizacaoCapturada = {
        cep: onlyDigits(geo?.postalCode).slice(0, 8),
        rua: (geo?.street || '').trim().slice(0, 100),
        numero: (geo?.streetNumber || 'S/N').trim().slice(0, 100),
        referencia,
        bairro,
        cidade,
      };

      setUltimaLocalizacao(resultado);
      return resultado;
    } catch {
      setErroGps('Não foi possível obter sua localização pelo GPS.');
      return null;
    } finally {
      setCapturandoGps(false);
    }
  }, []);

  const limparLocalizacao = useCallback(() => {
    setUltimaLocalizacao(null);
    setErroGps(null);
  }, []);

  return {
    capturandoGps,
    erroGps,
    ultimaLocalizacao,
    capturarLocalizacao,
    limparLocalizacao,
  };
}
