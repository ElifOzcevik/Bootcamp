const folders = [
    {
      id: 5,
      name: 'Klasör 1',
      files: [
        { id: 17, name: 'profil.jpg' },
        { id: 18, name: 'manzara.jpg'},
      ],
    },
    {
      id: 6,
      name: 'Klasör 2',
      files: [
        { id: 21, name: 'profil.jpg' },
        { id: 22, name: 'dosya.xls' },
      ],
    },
    {
      id: 7,
      name: 'Klasör 3',
    },
  ]

const copy = (fileId,folderId) => {
    let file;
  folders.forEach((item) => {
    if (item.files) {
      let selectedFiles = item.files.find((x) => x.id === fileId);
      if (selectedFiles) file = selectedFiles;
    }
  });
  const folder = folders.find((item) => item.id === folderId);
  if (folder && folder.files) {
    folder.files = [...folder.files, file];
  } else {
    folder.files = [file];
  }
  console.log(`Kopyalama işlemi başarıyla gerçekleştirildi!`);
  console.log(folders.map((f) => f.files));
};

const parentFolderOf = (fileId) => {
    folders.forEach((item) => {
        if (item.files && item.files.find((n) => n.id === fileId)) {
            return console.log(fileId, "id'li klasörün parent'ı :", item.id)
        }
      });
}
const remove = (fileId) => {
    let selectedFile;
    folders.map((item) => {
      if (item.files) {
        selectedFile = item.files.find((item) => item.id === fileId);
        if (selectedFile) {
          item.files = item.files.filter((item) => item.id !== selectedFile.id);
        }
      }
    });
    console.log(`Klasör silme işlemi başarıyla gerçekleştirildi!`);
    console.log(folders.map((f) => f.files));
};

const removeFolder = (folderId) => {
    console.log(`Dosya silme işlemi başarıyla gerçekleştirildi!`);
    console.log(folders.filter(item => item.id !== folderId));
};

const move = (fileId, folderId) => {
    const cutFolder =  folders.find(item => item.files && item.files.find(x => x.id === fileId ))
    const pasteFolder = folders.find((file) => file.id === folderId)

    if (cutFolder.files){
      const fileIndex = cutFolder.files.findIndex((n) => n.id === fileId)
      if (pasteFolder.files ) {
        pasteFolder.files.push(cutFolder.files[fileIndex])

    } else {
            pasteFolder.files = {files: cutFolder.files[fileIndex]}
    }
    cutFolder.files.splice(fileIndex, 1);
    console.log(`Taşıma işlemi başarıyla gerçekleştirildi!`);
    console.log(folders.map((f) => f.files));
    }
  };
move(17,6);
removeFolder(6);
remove(17);
parentFolderOf(17); 
copy(18,7);
