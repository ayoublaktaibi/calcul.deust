document.addEventListener('DOMContentLoaded', () => {
    const semesters = document.querySelectorAll('.semester');
    const summaryTable = document.querySelector('.summary table tbody');
    const scoreButton = document.querySelector('.score');
    const resultButton = document.querySelector('.result button.valid');

    function calculateAverage(arr) {
        if (arr.length === 0) return 0;
        const validNotes = arr.filter(note => {
            const parsedNote = parseFloat(note);
            return !isNaN(parsedNote) && parsedNote >= 0 && parsedNote <= 20;
        });
        const sum = validNotes.reduce((acc, curr) => acc + parseFloat(curr), 0);
        return validNotes.length > 0 ? sum / validNotes.length : 0;
    }

    function updateSemesterAverage(semesterIndex) {
        const semester = semesters[semesterIndex];
        const noteCells = semester.querySelectorAll('.note-cell');
        const notes = Array.from(noteCells).map(cell => cell.textContent.trim());
        const average = calculateAverage(notes).toFixed(2);

        const summaryRow = summaryTable.querySelector(`tr:nth-child(${semesterIndex + 1})`);
        summaryRow.querySelector('td:nth-child(2)').textContent = average;

        // Mise à jour de l'affichage de la moyenne du semestre
        const semesterAverageSpan = semester.querySelector('.semester-average');
        semesterAverageSpan.textContent = `Moyenne: ${average}`;

        const overallAverage = calculateOverallAverage();
        scoreButton.textContent = overallAverage;

        updateResultStatus();
    }

    function handleNoteInput(cell, semesterIndex) {
        const parsedValue = parseFloat(cell.textContent.trim());
        const resultCell = cell.previousElementSibling; // La cellule avec le résultat

        if (parsedValue < 0 || isNaN(parsedValue) || parsedValue > 20) {
            cell.textContent = '';
            cell.classList.add('alert');
            setTimeout(() => {
                cell.classList.remove('alert');
                resultCell.textContent = ''; // Vide le résultat si la note est invalide
                updateSemesterAverage(semesterIndex); // Met à jour la moyenne même après alerte
            }, 1500);
        } else {
            if (parsedValue >= 0 && parsedValue < 5) {
                resultCell.textContent = 'Ajournée';
            } else if (parsedValue >= 5 && parsedValue < 10) {
                resultCell.textContent = 'Non validé';
            } else if (parsedValue >= 10 && parsedValue <= 20) {
                resultCell.textContent = 'Validé';
            }
            updateSemesterAverage(semesterIndex);
        }
    }

    semesters.forEach((semester, index) => {
        const noteCells = semester.querySelectorAll('.note-cell');
        noteCells.forEach(cell => {
            cell.addEventListener('input', () => {
                handleNoteInput(cell, index);
            });
        });
    });

    function calculateOverallAverage() {
        let totalSum = 0;
        let totalCount = 0;

        semesters.forEach((semester) => {
            const noteCells = semester.querySelectorAll('.note-cell');
            const notes = Array.from(noteCells).map(cell => parseFloat(cell.textContent.trim())).filter(note => !isNaN(note) && note >= 0 && note <= 20);
            const sum = notes.reduce((acc, curr) => acc + curr, 0);
            totalSum += sum;
            totalCount += notes.length;
        });

        return totalCount > 0 ? (totalSum / totalCount).toFixed(2) : '0';
    }

    // Boutons de défilement (scroll buttons)
    document.getElementById('prev').addEventListener('click', function() {
        const activeSemester = document.querySelector('.semester-btn.active');
        if (activeSemester && activeSemester.previousElementSibling) {
            activeSemester.previousElementSibling.click();
        }
    });

    document.getElementById('next').addEventListener('click', function() {
        const activeSemester = document.querySelector('.semester-btn.active');
        if (activeSemester && activeSemester.nextElementSibling) {
            activeSemester.nextElementSibling.click();
        }
    });

    // Ajout d'écouteurs d'événements pour les boutons de semestre
    document.querySelectorAll('.semester-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const semesterIndex = parseInt(this.getAttribute('data-semester'), 10) - 1;
            const semesterWidth = document.querySelector('.semester').offsetWidth * 1.03;
            const scrollAmount = semesterIndex * semesterWidth;

            document.querySelector('.container').scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });

            // Toggle active class for styling
            document.querySelectorAll('.semester-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // Activer le premier bouton de semestre au chargement
    document.querySelector('.semester-btn[data-semester="1"]').click();

    // Mettre à jour le score global initial et le statut du résultat
    scoreButton.textContent = calculateOverallAverage();
    updateResultStatus();

    // Fonction pour mettre à jour le statut du résultat en fonction du score global
    function updateResultStatus() {
        const overallAverage = parseFloat(scoreButton.textContent);

        if (isNaN(overallAverage)) {
            resultButton.textContent = '';
        } else if (overallAverage >= 10) {
            resultButton.textContent = 'Validé';
        } else if (overallAverage >= 5) {
            resultButton.textContent = 'Non validé';
        } else {
            resultButton.textContent = 'Ajournée';
        }
    }
});
