<template>
  <q-page>
    <div class="q-pa-md">
      <div class="search-container">
        <label
          style="font-size: 1.5em; text-align: center"
          for="search"
          class="search-label"
        >
        </label>
        <div class="search-input">
          <input id="search" type="text" v-model="search" />
          <i class="material-icons search-icon" v-if="!search">search</i>
        </div>
      </div>
      <q-table
        v-if="filteredEncomendas.length > 0"
        flat
        bordered
        title="Lista de Correspondências"
        :rows="filteredEncomendas"
        :column="computedColumns"
        row-key="id"
        binary-state-sort
      />
      <div v-else>{{ noEncomendasMessage }}</div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  useCondominosStore,
  EncomendaConsulta,
} from '../stores/condominosStore';
import { useFuncionariosStore } from '../stores/funcionarioStore';

const useCondominos = useCondominosStore();
const search = ref('');
const useFuncionario = useFuncionariosStore();

function getEncomendasInternasESedex(): EncomendaConsulta[] {
  let encomendasCondominos = useCondominos.condominos.reduce(
    (acc: EncomendaConsulta[], condomino) => {
      acc.push(
        ...condomino.encomendas
          .filter(
            (encomenda) =>
              encomenda.tipo === 'interno' || encomenda.tipo === 'sedex'
          )
          .map((encomenda) => ({
            conjunto: encomenda.conjunto,
            destinatario: encomenda.destinatario,
            conteudo: encomenda.conteudo,
            tipo: encomenda.tipo,
          }))
      );
      return acc;
    },
    []
  );

  let encomendasFuncionarios = useFuncionario.funcionarios.reduce(
    (acc: EncomendaConsulta[], funcionario) => {
      acc.push(
        ...funcionario.encomendas
          .filter(
            (encomenda) =>
              encomenda.tipo === 'interno' || encomenda.tipo === 'sedex'
          )
          .map((encomenda) => ({
            conjunto: encomenda.conjunto,
            destinatario: encomenda.destinatario,
            conteudo: encomenda.conteudo,
            tipo: encomenda.tipo,
          }))
      );
      return acc;
    },
    []
  );

  return [...encomendasCondominos, ...encomendasFuncionarios];
}

const encomendasConsulta = computed(getEncomendasInternasESedex);
const noEncomendasMessage = computed(() => {
  return filteredEncomendas.value.length === 0 ? 'Não há encomendas.' : '';
});

const filteredEncomendas = computed(() => {
  const searchValue = search.value.toLowerCase().trim();
  return encomendasConsulta.value.filter(
    (encomenda) =>
      encomenda.conjunto.toLowerCase().includes(searchValue) ||
      encomenda.destinatario.toLowerCase().includes(searchValue)
  );
});

const computedColumns = computed(() => {
  return [
    {
      name: 'conjunto',
      label: 'Conjunto',
      align: 'left',
      required: true,
      field: 'conjunto',
      sortable: true,
    },
    {
      name: 'destinatario',
      label: 'Destinatario',
      align: 'left',
      required: true,
      field: 'destinatario',
      sortable: true,
    },
    {
      name: 'conteudo',
      label: 'Conteúdo',
      align: 'left',
      required: true,
      field: 'conteudo',
      sortable: true,
    },
    {
      name: 'tipo',
      label: 'Tipo',
      align: 'left',
      required: true,
      field: 'tipo',
      sortable: true,
    },
  ];
});
</script>
<style scoped lang="scss">
.search-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 2rem;
  margin-bottom: 10px;
}

.search-label {
  margin-right: 10px;
  margin-left: 2rem;
}

.search-input {
  position: relative;
  width: 8rem;
  color: #000;
  margin-top: 2rem;
}

#search {
  width: 100%;
  height: 2rem;
  padding-left: 2rem;
  text-align: left;
  background-color: #d9d2d2;
}

.search-icon {
  position: absolute;
  left: 3px;
  top: 7px;
  font-size: 23px;
}
</style>
../stores/condominosStore src/stores/funcionarioStore
