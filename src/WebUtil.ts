import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'

import { Todo } from './inter/Todo'

let _dbIndex = 0
let Store = new Map<number, Todo>()

export const dbData = () => {
    console.group('keys:')

    const keys = Store.keys()
    for(let key of keys){
        console.log('id => ' + key)
    }

    console.group('values:')

    const values = Store.values()
    for(let value of values){
        console.log(value)
    }
}

export const put = (value: string): Observable<Todo> => {
    return Observable.create(( observer: Observer<Todo> ) => {
        let status = 'pending'

        let timer = setTimeout(() => {
            let res = {
                id: _dbIndex++,
                value,
                done: false
            }

            Store.set(res.id, res)

            observer.next(res)
            observer.complete()
        }, 100)

        return () => {
            clearTimeout(timer)
            console.warn('put canceled...')
        }
    })
}

export const post = (id: number, value?: string): Observable<Todo> => {
    return Observable.create(( observer: Observer<Todo> ) => {
        let timer = setTimeout(() => {
            let todo = Store.get(id)

            if(value !== void 0) {
                todo.value = value
            } else {
                todo.done = !todo.done
            }

            Store.set(id, todo)

            observer.next(todo)
            observer.complete()
        }, 100)

        return () => {
            clearTimeout(timer)
            console.log('post canceled...')
        }
    })
}

export const del = (id: number): Observable<Todo> => {
    return Observable.create(( observer: Observer<Todo> ) => {
        let timer = setTimeout(() => {
            const todo = Store.get(id)
            Store.delete(id)

            observer.next(todo)
            observer.complete()
        }, 100)

        return () => {
            clearTimeout(timer)
            console.log('del canceled...')
        }
    })
}

export const search = (value: string): Observable<Todo[]> => {
    return Observable.create(( observer: Observer<Todo[]> ) => {
        let timer = setTimeout(() => {
            let todos = [];

            if(value !== '') {
                const values = Store.values();
                for(let todo of values) {
                    if(todo && todo.value.indexOf(value) >= 0) {
                        todos.push(todo)
                    }   
                }
            }

            observer.next(todos)
            observer.complete()
        }, 100)

        return () => {
            clearTimeout(timer)
            console.log('search canceled...')
        }
    })
}