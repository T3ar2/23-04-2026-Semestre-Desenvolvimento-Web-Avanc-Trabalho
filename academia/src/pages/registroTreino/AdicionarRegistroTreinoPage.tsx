import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { criarRegistroTreino } from "../../api/registroTreino";
import { listarAlunos } from "../../api/aluno";
import { listarExercicios } from "../../api/exercicio";
import { listarPlanosTreino, listarPlanoTreinoPorId } from "../../api/planoTreino";
import { AlunoDto, PlanoTreinoDto } from "../../api/types";

export function AdicionarRegistroTreinoPage() {
  const navigate = useNavigate();
  const [alunos, setAlunos] = useState<AlunoDto[]>([]);
  const [exercicios, setExercicios] = useState<any[]>([]);
  const [planosTreino, setPlanosTreino] = useState<PlanoTreinoDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [alunoId, setAlunoId] = useState<number | "">("");
  const [planoTreinoId, setPlanoTreinoId] = useState<number | "">("");
  const [dataExecucao, setDataExecucao] = useState("");
  const [exerciciosRealizados, setExerciciosRealizados] = useState<
    { exercicioId: number | ""; series: number; repeticoes: number; carga: number }[]
  >([]);

  async function carregarDadosIniciais() {
    setLoading(true);
    try {
      const [listaAlunos, listaExercicios, listaPlanos] = await Promise.all([
        listarAlunos(),
        listarExercicios(),
        listarPlanosTreino(),
      ]);
      setAlunos(listaAlunos);
      setExercicios(listaExercicios);
      setPlanosTreino(listaPlanos);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? "Falha ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void carregarDadosIniciais();
  }, []);

  async function handlePlanoTreinoChange(idStr: string) {
    const id = Number(idStr);
    setPlanoTreinoId(id || "");
    
    if (!id) {
      return;
    }

    setLoading(true);
    try {
      const plano = await listarPlanoTreinoPorId(id);
      const exerciciosMapeados = plano.exerciciosPlanejados.map((ep) => ({
        exercicioId: ep.exercicioId,
        series: ep.series,
        repeticoes: ep.repeticoes,
        carga: 0,
      }));
      setExercicios