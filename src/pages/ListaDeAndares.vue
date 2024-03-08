<template>
  <q-page>
    <div class="q-pa-md">
      <q-table
        flat
        bordered
        title="Lista de Andares"
        :rows="store.condominos"
        :columns="columns"
        row-key="conjunto"
        binary-state-sort
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="conjunto" :props="props">{{ props.row.conjunto }}</q-td>

            <q-td key="especialidade" :props="props">
              {{ props.row.especialidade }}
              <q-popup-edit
                v-model="props.row.especialidade"
                title="Alterar?"
                buttons
                v-slot="scope"
              >
                <q-input type="text" v-model="scope.value" dense autofocus />
              </q-popup-edit>
            </q-td>

            <q-td key="locatario" :props="props">
              {{ props.row.locatario.join(', ') }}
              <q-popup-edit
                v-model="props.row.locatario"
                title="Alterar?"
                buttons
                v-slot="scope"
              >
                <q-input type="text" v-model="scope.value" dense autofocus />
              </q-popup-edit>
            </q-td>
            <q-td key="interfone" :props="props">
              {{ props.row.interfone }}
              <q-popup-edit
                v-model="props.row.interfone"
                title="Alterar?"
                buttons
                v-slot="scope"
              >
                <q-input type="text" v-model="scope.value" dense autofocus />
              </q-popup-edit>
            </q-td>

            <q-td key="proprietario" :props="props">
              {{ props.row.proprietario }}
              <q-popup-edit
                v-model="props.row.proprietario"
                title="Alterar?"
                buttons
                v-slot="scope"
              >
                <q-input type="text" v-model="scope.value" dense autofocus />
              </q-popup-edit>
            </q-td>

            <q-td key="telefone" :props="props">
              {{ props.row.telefone }}
              <q-popup-edit
                v-model="props.row.telefone"
                title="Alterar?"
                buttons
                v-slot="scope"
              >
                <q-input type="phone" v-model="scope.value" dense autofocus />
              </q-popup-edit>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
<script setup>
import { useCondominosStore } from '../stores/condominos-store';

const store = useCondominosStore();

const columns = [
  {
    name: 'conjunto',
    label: 'Número do Conj.',
    align: 'center',
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'especialidade',
    align: 'left',
    label: 'Especialidade',
    required: true,
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'locatario',
    label: 'Locatário',
    align: 'left',
    required: true,
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  { name: 'interfone', label: 'Interfonar', field: 'interfone', align: 'left' },
  {
    name: 'proprietario',
    label: 'Proprietário',
    align: 'left',
    required: true,
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },

  { name: 'telefone', label: 'Telefone', field: 'telefone', align: 'left' },
];
</script>
