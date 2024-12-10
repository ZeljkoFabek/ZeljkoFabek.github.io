const baseUrl = getCookie('baseUrl');

// Funkcija za postavljanje kolačića
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/" + "; SameSite=Strict";
}

// Funkcija za dohvaćanje kolačića
function getCookie(name) {
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookies = decodedCookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let c = cookies[i].trim();
    if (c.indexOf(name + "=") === 0) {
      return c.substring(name.length + 1);
    }
  }
  return "";
}

// Globalna varijabla za trenutni jezik (podesi iz glavne stranice)
let currentLanguage = getCookie('language') || 'en';

// Dohvati ID projekta iz URL-a
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('id');

// Učitaj detalje projekta
function loadProjectDetails() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `${baseUrl}json/projects-detail.json`, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      try {
        const projects = JSON.parse(xhr.responseText);

        // Pronađi projekt prema ID-u
        var project = null;
        for (var i = 0; i < projects.length; i++) {
          if (projects[i].id === projectId) {
            project = projects[i];
            break;
          }
        }

        if (!project) {
          console.error('Project not found');
          return;
        }

        // Pronađi prijevode za trenutni jezik
        var translation = project.translations[currentLanguage];

        // Postavi naslov stranice
        document.getElementById('project-title').textContent = translation.title;
        document.getElementById('project-h1').textContent = translation.h1;

        // Postavi prijevode za sekcije
        document.getElementById('description-title').textContent = translation.descriptionTitle;
        document.getElementById('project-description').textContent = translation.description;

        document.getElementById('key-features-title').textContent = translation.keyFeaturesTitle;
        var featuresList = document.getElementById('project-features');
        for (var j = 0; j < translation.keyFeatures.length; j++) {
          var li = document.createElement('li');
          li.textContent = translation.keyFeatures[j];
          featuresList.appendChild(li);
        }

        document.getElementById('screenshots-title').textContent = translation.screenshotsTitle;
        var screenshotsContainer = document.getElementById('project-screenshots');

        for (var k = 0; k < project.screenshots.length; k++) {
          var colDiv = document.createElement('div');
          colDiv.className = 'col-md-4';
          colDiv.innerHTML = '<a href="'+ baseUrl + project.screenshots[k] + '" target="_self" class="text-decoration-none">' +
                             '<img src="' + project.screenshots[k] + '" class="img-fluid" alt="Screenshot"><br><br>' +
                             '</a>';

          screenshotsContainer.appendChild(colDiv);
        }
      } catch (error) {
        console.error('Error parsing projects-detail.json:', error);
      }
    }
  };

  xhr.send();
}

// Pokreni učitavanje podataka
document.addEventListener('DOMContentLoaded', loadProjectDetails);
