require('bootstrap.min.css')
require('./style.css')

import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
// observable
import 'rxjs/add/observable/fromEvent'
// operator
import 'rxjs/add/operator/publish'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/merge'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/mapTo'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/distinct'
import 'rxjs/add/operator/debounceTime'

import { createTodoItem } from './TodoItem'
import { put, post, del, dbData, search } from './WebUtil';
import { ITodo } from './inter/ITodo';

const $input = <HTMLInputElement>document.querySelector('.todo-val')
const $list = document.querySelector('.list-group')
const $add = document.querySelector('.button-add')

const keydown$ = Observable.fromEvent<KeyboardEvent>($input, 'keydown')
    .publish()
    .refCount()

const enter$ = keydown$.filter(e => e.keyCode === 13)

const clickAdd$ = Observable.fromEvent<MouseEvent>($add, 'click')

const input$ = enter$.merge(clickAdd$)

const clearInputSubject$ = new Subject<void>()
const item$ = input$
    .map(() => $input.value)
    .filter(v => v !== '')
    .distinct(null, clearInputSubject$)
    .switchMap(put)
    .map(createTodoItem)
    .do((el: HTMLLIElement) => {
        $list.appendChild(el)
        $input.value = ''
    })
    .do(dbData)
    .publish()
    .refCount()

const toggle$ = item$
    .mergeMap($todoItem => {
        return Observable.fromEvent<MouseEvent>($todoItem, 'click')
            .debounceTime(300)
            .filter(e => e.target === $todoItem)
            .mapTo({
                data: {
                    id: +$todoItem.dataset['id']
                },
                $todoItem
            })
    })
    .switchMap(r => {
        return post(r.data.id).mapTo(r.$todoItem)
    })
    .do(($todoItem: HTMLElement) => $todoItem.classList.toggle('done'))
    .do(dbData)

const del$ = item$
    .mergeMap($todoItem => {
        const $removeButton = $todoItem.children[0]
        return Observable.fromEvent<MouseEvent>($removeButton, 'click')
            .mapTo({
                data: {
                    id: +$todoItem.dataset['id']
                },
                $todoItem
            })
    })
    .switchMap(r => {
        return del(r.data.id).mapTo(r.$todoItem)
    })
    .do(($todoItem: HTMLElement) => {
        let $parent = $todoItem.parentNode
        console.log($todoItem)
        $parent.removeChild($todoItem)
    })
    .do(dbData)


const arrayProp = Array.prototype
const clearActive = () => {
    const actived = document.querySelectorAll('.active')
    arrayProp.forEach.call(actived, (item: HTMLElement) => {
        item.classList.remove('active')
    })
}
const search$ = keydown$
    .debounceTime(300)
    .filter(e => e.keyCode !== 13)
    .map(e => (<HTMLInputElement>e.target).value)
    .switchMap(search)
    .do(clearActive)
    .do((todos: ITodo[]) => {
        if (todos && todos.length) {
            todos.forEach(todo => {
                let item = document.querySelector(`#todo-item-${todo.id}`)
                item.classList.add('active')
            })
        } else {
            clearActive()
        }
    })

const app$ = toggle$.merge(del$, search$)
app$.subscribe()