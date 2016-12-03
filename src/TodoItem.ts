import { Todo } from './inter/Todo';

export const createTodoItem = (todo: Todo): HTMLLIElement => {
  const dom = document.createElement('li');
  dom.classList.add('list-group-item');
  dom.setAttribute('id', `todo-item-${todo.id}`)
  dom.setAttribute('data-id', `${todo.id}`)  

  const innerHTML = `
    ${todo.value}
    <button type="button" class="btn btn-default button-remove" aria-label="right Align">
      <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
    </button>
  `;

  dom.innerHTML = innerHTML;

  return dom;
}