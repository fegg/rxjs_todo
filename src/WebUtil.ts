import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'

import { ITodo } from './inter/ITodo'

let _dbIndex = 0
let Store = new Map<number, ITodo>()

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

export const put = (value: string): Observable<ITodo> => {
    return Observable.create(( observer: Observer<ITodo> ) => {
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

export const post = (id: number, value?: string): Observable<ITodo> => {
    return Observable.create(( observer: Observer<ITodo> ) => {
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

export const del = (id: number): Observable<ITodo> => {
    return Observable.create(( observer: Observer<ITodo> ) => {
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

export const search = (value: string): Observable<ITodo[]> => {
    return Observable.create(( observer: Observer<ITodo[]> ) => {
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