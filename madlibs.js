function parseStory(rawStory) {
  const regex = /(\w+)\[([nva])\]|(\w+)|([,.])/g;
  const parts = [];
  let match;

  while ((match = regex.exec(rawStory)) !== null) {
    if (match[1] && match[2]) {
      parts.push({ word: match[1], pos: match[2] });
    } else if (match[3]) {
      parts.push({ word: match[3] });
    } else if (match[4]) {
      parts.push({ word: match[4] });
    }
  }

  return parts;
}

getRawStory()
  .then(parseStory)
  .then((processedStory) => {
    displayStory(processedStory);
  });

function displayStory(story) {
  const editDiv = document.querySelector('.madLibsEdit');
  const previewDiv = document.querySelector('.madLibsPreview');

  editDiv.innerHTML = '';
  previewDiv.innerHTML = '';

  story.forEach(part => {
    if (part.pos) {
      const input = document.createElement('input');
      input.setAttribute('maxlength', '20');
      input.setAttribute('placeholder', part.pos);
      input.setAttribute('data-pos', part.pos);
      input.addEventListener('input', updatePreview);
      input.addEventListener('keydown', handleEnterKey);

      const span = document.createElement('span');
      span.textContent = part.word;
      span.style.display = 'none';

      editDiv.appendChild(input);
      previewDiv.appendChild(span);
    } else {
      const textNodeEdit = document.createTextNode(part.word + (part.word.match(/[,.]/) ? '' : ' '));
      const textNodePreview = document.createTextNode(part.word + (part.word.match(/[,.]/) ? '' : ' '));

      editDiv.appendChild(textNodeEdit);
      previewDiv.appendChild(textNodePreview);
    }
  });
}

function updatePreview(event) {
  const inputs = document.querySelectorAll('.madLibsEdit input');
  const spans = document.querySelectorAll('.madLibsPreview span');

  inputs.forEach((input, index) => {
    spans[index].textContent = input.value || input.getAttribute('placeholder');
    spans[index].style.display = input.value ? 'inline' : 'none';
  });
}

function handleEnterKey(event) {
  if (event.key === 'Enter') {
    const inputs = Array.from(document.querySelectorAll('.madLibsEdit input'));
    const currentIndex = inputs.indexOf(event.target);
    if (currentIndex >= 0 && currentIndex < inputs.length - 1) {
      inputs[currentIndex + 1].focus();
    }
  }
}
