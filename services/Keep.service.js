import { utilService } from './util.service.js';
import { storageService } from './storage.service.js';

export const noteService = {
  query,
  createNote,
  deleteNote,
  copyNote,
  updateNote,
  handleImgSrcError,
  saveNotesToStorage,
};

const KEY = 'notes';
let gNotes;

_createNotes();

function query() {
  return Promise.resolve(gNotes);
}

function addNote(noteToAdd) {
  gNotes.unshift(noteToAdd);
  saveNotesToStorage();
  return Promise.resolve(noteToAdd);
}

function deleteNote(noteId) {
  let noteIdx = gNotes.findIndex((note) => note.id === noteId);
  gNotes.splice(noteIdx, 1);
  saveNotesToStorage();
  return Promise.resolve();
}

function copyNote(noteId) {
  let noteIdx = gNotes.findIndex((note) => note.id === noteId);
  let notesCopy = JSON.parse(JSON.stringify(gNotes));
  let noteCopy = notesCopy.copyWithin(0, noteIdx, noteIdx + 1).shift();
  noteCopy.id = utilService.makeId();
  gNotes.push(noteCopy);
  saveNotesToStorage();
  return Promise.resolve();
}

function updateNote(noteId, note) {
  let noteIdx = gNotes.findIndex((note) => note.id === noteId);

  if (noteIdx === -1) {
    console.log('Error. Cant find noteIdx in updateNote');
    return;
  }
  gNotes[noteIdx] = note;
  saveNotesToStorage();
  return Promise.resolve();
}

function changeVideoLinkEmbed(linkStr) {
  let embedLink = linkStr.replace('watch?v=', 'embed/');
  return embedLink;
}

function handleImgSrcError(image) {
  let defaultImg = 'assets\img\UltraMegaHackerMan.png';
  image.src = defaultImg;
}

function createNote(inputVal, noteType) {
  if (!inputVal) return;
  let note = {
    id: utilService.makeId(),
    type: noteType,
    isPinned: false,
    style: {
      backgroundColor: '#c988ff',
    },
  };

  switch (noteType) {
    case 'NoteText':
      note.info = {
        txt: inputVal,
      };
      break;
    case 'NoteImg':
      note.info = {
        imgUrl: inputVal,
      };
      break;
    case 'NoteVideo':
      note.info = {
        videoUrl: changeVideoLinkEmbed(inputVal),
      };
      break;
    case 'NoteTodos':
      note.info = {
        label: inputVal,
        todos: [],
      };
      break;

    default:
      return 'switch error';
  }

  addNote(note);
}

function _createNotes() {
  let notes = storageService.loadFromStorage(KEY);
  if (!notes || !notes.length) {
    notes = [
      {
        id: utilService.makeId(),
        type: 'NoteText',
        isPinned: true,
        info: {
          txt:
            "very manly note",
        },
        style: {
          backgroundColor: '#b1ffaa',
        },
      },
      {
        id: utilService.makeId(),
        type: 'NoteImg',
        isPinned: true,
        info: {
          imgUrl: 'https://i.imgur.com/JfUd9W5.png',
        },
        style: {
          backgroundColor: '#68fff0',
        },
      },
      {
        id: utilService.makeId(),
        type: 'NoteImg',
        isPinned: false,
        info: {
          imgUrl: 'https://img.csfd.cz/files/images/user/profile/160/378/160378443_4eccbd.jpg',
        },
        style: {
          backgroundColor: '#75acff',
        },
      },
      {
        id: utilService.makeId(),
        type: 'NoteVideo',
        isPinned: false,
        info: {
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        },
        style: {
          backgroundColor: '#c988ff',
        },
      },

      {
        id: utilService.makeId(),
        type: 'NoteTodos',
        isPinned: false,
        info: {
          label: 'To do',
          todos: [
            { txt: 'learn react kung fu', isDone: true },
            { txt: 'kill nazis', isDone: true },
            { txt: 'water plants', isDone: true },
            { txt: 'Repeat', isDone: false },
          ],
        },
        style: {
          backgroundColor: '#ff8882',
        },
      },
    ];
  }
  gNotes = notes;
  saveNotesToStorage();
}

function saveNotesToStorage() {
  storageService.saveToStorage(KEY, gNotes);
}