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
              {{
                Array.isArray(props.row.locatario)
                  ? props.row.locatario.join(', ')
                  : props.row.locatario
              }}
              <q-popup-edit
                v-model="props.row.locatario"
                title="Alterar?"
                buttons
                v-slot="scope"
              >
                <q-input
                  type="text"
                  v-model="scope.value"
                  dense
                  autofocus
                  @keyup.enter="scope.value = scope.value.split(',')"
                />
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
import { useCondominosStore } from '../stores/condominosStore';

const store = useCondominosStore();

const columns = [
  {
    name: 'conjunto',
    label: 'Número do Conj.',
    align: 'center',
    field: 'conjunto', // Acessa a propriedade 'conjunto' do objeto da linha
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'especialidade',
    align: 'left',
    label: 'Especialidade',
    required: true,
    field: 'especialidade', // Acessa a propriedade 'especialidade' do objeto da linha
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'locatario',
    label: 'Locatário',
    align: 'left',
    required: true,
    field: 'locatario', // Acessa a propriedade 'locatario' do objeto da linha
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'interfone',
    label: 'Interfonar',
    field: 'interfone', // Acessa a propriedade 'interfone' do objeto da linha
    align: 'left',
  },
  {
    name: 'proprietario',
    label: 'Proprietário',
    align: 'left',
    required: true,
    field: 'proprietario', // Acessa a propriedade 'proprietario' do objeto da linha
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'telefone',
    label: 'Telefone',
    field: 'telefone', // Acessa a propriedade 'telefone' do objeto da linha
    align: 'left',
  },
];
</script>
../stores/condominosStore
