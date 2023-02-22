// Fonction au chargement de la page (chargement des données dans le localStorage, nom d'utilisateur localStorage, fonction écouteur d'évènement = stocker / changer nom d'utilisateur)

window.addEventListener('load', () => {
	todos = JSON.parse(localStorage.getItem('todos')) || []; // charge les tâches stockées dans le localStorage s'il y en a, ou crée un tableau vide s'il n'y en a pas encore
	const nameInput = document.querySelector('#name');
	const newTodoForm = document.querySelector('#new-todo-form');

	const username = localStorage.getItem('username') || '';

	nameInput.value = username;

	nameInput.addEventListener('change', (e) => {
		localStorage.setItem('username', e.target.value);
	})

	newTodoForm.addEventListener('submit', e => {
		e.preventDefault(); // empêche la page de se recharger

		// Const qui permet de récupérer les valeurs entrées par l'utilisateur dans le formulaire

		const todo = {
			content: e.target.elements.content.value,
			category: e.target.elements.category.value,
			done: false, // Utilisé plus tard pour savoir si la tâches est terminée ou non
			createdAt: new Date().getTime()
		}

		todos.push(todo); // ajoute todo au tableau todos

		// Enregistrement du todos dans le stockage puis convertir en chaîne de caractères JSON
		localStorage.setItem('todos', JSON.stringify(todos));

		// Reinitialisation du formulaire
		e.target.reset();
		
		// Met a jour la liste des taches en fonction du contenu todos
		DisplayTodos()
	})

	DisplayTodos()
})

function DisplayTodos () {
	const todoList = document.querySelector('#todo-list');
	todoList.innerHTML = "";

	todos.sort((a,b) => b.createdAt - a.createdAt);
	todos.forEach(todo => {
		const todoItem = document.createElement('div');
		todoItem.classList.add('todo-item');

		const label = document.createElement('label');
		const input = document.createElement('input');
		const span = document.createElement('span');
		const date = document.createElement('date');
		const content = document.createElement('div');
		const actions = document.createElement('div');
		const edit = document.createElement('button');
		const deleteButton = document.createElement('button');

		input.type = 'checkbox';
		input.checked = todo.done;
		span.classList.add('bubble');
		if (todo.category === 'personal') {
			span.classList.add('personal');
		} else {
			span.classList.add('business');
		}
		content.classList.add('todo-content');
		date.classList.add('todo-date');
		actions.classList.add('actions');
		edit.classList.add('edit');
		deleteButton.classList.add('delete');


		content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
		edit.innerHTML = 'Edit';
		deleteButton.innerHTML = 'Delete';

		label.appendChild(input);
		label.appendChild(span);
		actions.appendChild(edit);
		actions.appendChild(deleteButton);
		todoItem.appendChild(label);
		todoItem.appendChild(content);
		todoItem.appendChild(date);
		todoItem.appendChild(actions);
		

		// Ajout de l'heure à laquelle la tâche a été ajoutée
		const dateString = new Date(todo.createdAt).toLocaleString();
		date.textContent = dateString;


		todoList.appendChild(todoItem);

		if (todo.done) {
			todoItem.classList.add('done');
		}
		
		input.addEventListener('change', (e) => {
			todo.done = e.target.checked;
			localStorage.setItem('todos', JSON.stringify(todos));

			if (todo.done) {
				todoItem.classList.add('done');
			} else {
				todoItem.classList.remove('done');
			}

			DisplayTodos()

		})

		edit.addEventListener('click', (e) => {
			const input = content.querySelector('input');
			input.removeAttribute('readonly');
			input.focus();
			input.addEventListener('blur', (e) => {
				input.setAttribute('readonly', true);
				todo.content = e.target.value;
				localStorage.setItem('todos', JSON.stringify(todos));
				DisplayTodos()

			})
		})

		deleteButton.addEventListener('click', (e) => {
			todos = todos.filter(t => t != todo);
			localStorage.setItem('todos', JSON.stringify(todos));
			DisplayTodos()
		})

	})
}