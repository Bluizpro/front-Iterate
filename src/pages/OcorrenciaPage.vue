<template>
  <q-page>
    <h1 style="font-size: 1.5em; text-align: center">Ocorrencia</h1>
    <div class="border">
      <div id="app">
        <div class="note-container">
          <div class="note-grid">
            <div v-for="(note, index) in notes" :key="index" class="note-card">
              <div
                class="text-container"
                :class="{
                  priority: note.priority,
                  'no-priority': !note.priority,
                }"
              >
                <div v-html="note.text" class="note-text"></div>
              </div>

              <q-btn
                label="Excluir"
                rounded
                color="negative"
                class="button-excluir"
                @click="() => deleteNote(index)"
              />
              <q-btn
                label="Prioridade"
                rounded
                color="warning"
                class="button-prioridade"
                @click="() => togglePriority(index)"
              />
            </div>
          </div>
          <div class="new-note">
            <div class="input-area">
              <q-editor v-model="newNote" style="height: 10rem; width: 68%" />
              <q-btn
                label="Salvar"
                rounded
                color="indigo-14"
                @click="addNote"
                class="save-button"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';

const newNote = ref('');
const notes = reactive([]);

const addNote = () => {
  if (newNote.value !== '') {
    notes.push({ text: newNote.value, priority: false });
    newNote.value = '';
    localStorage.setItem('notes', JSON.stringify(notes));
  }
};

const deleteNote = (index) => {
  notes.splice(index, 1);
  localStorage.setItem('notes', JSON.stringify(notes));
};

const togglePriority = (index) => {
  notes[index].priority = !notes[index].priority;
  localStorage.setItem('notes', JSON.stringify(notes));
};

onMounted(() => {
  if (localStorage.getItem('notes')) {
    notes.push(...JSON.parse(localStorage.getItem('notes')));
  }
});

onUnmounted(() => {
  localStorage.setItem('notes', JSON.stringify(notes));
});
</script>

<style scoped lang="scss">
.note-container {
  border: 3px solid #ccc;
  padding: 2rem;
  width: 80%;
  margin: auto;
}
.note-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}
.note-card {
  border: 1px solid #ccc;
  padding: 20px;
  margin-top: 1rem;
  border-radius: 15px;
}
.border {
  border: 1px solid #000 !important;
  margin-left: 6rem;
  margin-top: 2rem;
  margin-right: 5rem;
  padding: 5rem;
  background-color: rgb(235 208 208 / 20%);
}
.button-excluir {
  margin-top: 10px !important; /* Ajuste este valor para o espaçamento desejado */
}
.button-prioridade {
  margin-top: 10px !important;
}
.new-note {
  margin-top: 50px;
  .input-area {
    display: flex;
    justify-content: space-between;
    .save-button {
      width: 5rem;
      height: 3rem;
      margin-top: 9rem;
    }
  }
}
.priority {
  color: rgb(252, 2, 2);
}
.no-priority {
  color: black;
}
.note-text {
  display: flex;
  flex-direction: row;
  overflow-x: auto;
}
</style>
