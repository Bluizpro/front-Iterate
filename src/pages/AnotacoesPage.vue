<template>
  <q-page>
    <h1 style="font-size: 1.5em; text-align: center">Anotações</h1>
    <div id="app">
      <div class="note-container">
        <div class="note-grid">
          <div v-for="(note, index) in notes" :key="index" class="note-card">
            <p v-html="note.text"></p>
            <q-btn
              label="Excluir"
              rounded
              color="negative"
              @click="() => deleteNote(index)"
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
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';

const newNote = ref('');
const notes = reactive([]);

const addNote = () => {
  if (newNote.value !== '') {
    notes.push({ text: newNote.value });
    newNote.value = '';
    localStorage.setItem('notes', JSON.stringify(notes));
  }
};

const deleteNote = (index) => {
  notes.splice(index, 1);
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
  padding: 10px;
  margin-top: 1rem;
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
</style>
