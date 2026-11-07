import { useState, useMemo, useCallback } from 'react';
import { ChamadoFormSchema, extractZodFieldErrors } from '../utils/schemas';
import { gerarTriagemIaAutomatica } from '../services/chamadoService';
import { CategoriaChamado, Localizacao } from '../types';

export const FOTOS_SIMULADAS = [
  {
    rotulo: 'Buraco',
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
  },
  {
    rotulo: 'Poste Apagado',
    url: 'https://images.unsplash.com/photo-1780415493361-07c5a78dbaef?auto=format&fit=crop&w=800&q=80',
  },
  {
    rotulo: 'Bueiro',
    url: 'https://images.unsplash.com/photo-1581375922343-ac6b40caf5e3?auto=format&fit=crop&w=800&q=80',
  },
  {
    rotulo: 'Entulho',
    url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
  },
  {
    rotulo: 'Árvore/Galho',
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
  },
];

export const useChamadoForm = () => {
  const [titulo, setTituloState] = useState('');
  const [categoria, setCategoria] = useState<CategoriaChamado>('Buraco na Rua');
  const [descricao, setDescricaoState] = useState('');
  const [fotoUrl, setFotoUrl] = useState<string>(FOTOS_SIMULADAS[0].url);

  const [logradouro, setLogradouroState] = useState('');
  const [numero, setNumeroState] = useState('');
  const [bairro, setBairroState] = useState('');
  const [cidade, setCidade] = useState('São Paulo');
  const [cep, setCep] = useState('');
  const [pontoReferencia, setPontoReferencia] = useState('');
  const [coordenadas, setCoordenadas] = useState<{ lat: number; lng: number }>({
    lat: -23.5629,
    lng: -46.6544,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearFieldError = useCallback((field: string) => {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: '' } : prev));
  }, []);

  const setTitulo = useCallback(
    (v: string) => {
      setTituloState(v);
      clearFieldError('titulo');
    },
    [clearFieldError]
  );

  const setDescricao = useCallback(
    (v: string) => {
      setDescricaoState(v);
      clearFieldError('descricao');
    },
    [clearFieldError]
  );

  const setLogradouro = useCallback(
    (v: string) => {
      setLogradouroState(v);
      clearFieldError('logradouro');
    },
    [clearFieldError]
  );

  const setNumero = useCallback(
    (v: string) => {
      setNumeroState(v);
      clearFieldError('numero');
    },
    [clearFieldError]
  );

  const setBairro = useCallback(
    (v: string) => {
      setBairroState(v);
      clearFieldError('bairro');
    },
    [clearFieldError]
  );

  const triagemPreview = useMemo(
    () => gerarTriagemIaAutomatica(categoria, titulo, descricao),
    [categoria, titulo, descricao]
  );

  const preencherLocalizacaoSimulada = useCallback(() => {
    setLogradouroState('Avenida Paulista');
    setNumeroState('1106');
    setBairroState('Bela Vista');
    setCidade('São Paulo');
    setCep('01310-100');
    setPontoReferencia('Em frente ao Edifício FIESP e Metrô Trianon');
    setCoordenadas({ lat: -23.5629, lng: -46.6544 });
    setErrors((prev) => ({ ...prev, logradouro: '', numero: '', bairro: '' }));
  }, []);

  const validate = useCallback((): boolean => {
    const parsed = ChamadoFormSchema.safeParse({
      titulo: titulo.trim(),
      categoria,
      descricao: descricao.trim(),
      logradouro: logradouro.trim(),
      numero: numero.trim(),
      bairro: bairro.trim(),
      cep: cep.trim(),
      pontoReferencia: pontoReferencia.trim(),
      fotoUrl,
    });

    if (!parsed.success) {
      setErrors(extractZodFieldErrors(parsed.error));
      return false;
    }

    setErrors({});
    return true;
  }, [titulo, categoria, descricao, logradouro, numero, bairro, cep, pontoReferencia, fotoUrl]);

  const buildLocalizacao = useCallback((): Localizacao => {
    return {
      logradouro: logradouro.trim(),
      numero: numero.trim(),
      bairro: bairro.trim(),
      cidade: cidade.trim() || 'São Paulo',
      cep: cep.trim() || '01310-100',
      pontoReferencia: pontoReferencia.trim(),
      latitude: coordenadas.lat,
      longitude: coordenadas.lng,
    };
  }, [logradouro, numero, bairro, cidade, cep, pontoReferencia, coordenadas]);

  return {
    titulo,
    setTitulo,
    categoria,
    setCategoria,
    descricao,
    setDescricao,
    fotoUrl,
    setFotoUrl,
    logradouro,
    setLogradouro,
    numero,
    setNumero,
    bairro,
    setBairro,
    cidade,
    setCidade,
    cep,
    setCep,
    pontoReferencia,
    setPontoReferencia,
    coordenadas,
    setCoordenadas,
    errors,
    setErrors,
    triagemPreview,
    preencherLocalizacaoSimulada,
    validate,
    buildLocalizacao,
  };
};
