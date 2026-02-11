import {Logger} from "./logger.ts";

class Node<T> {
    private _prev: Node<T> | null;
    private _next: Node<T> | null;

    private _value: T;

    constructor(value: T, prev: Node<T> | null = null, next: Node<T> | null = null) {
        this._prev = prev;
        this._next = next;
        this._value = value;
    }

    public get prev(): Node<T> | null {
        return this._prev;
    }

    public set prev(value: Node<T> | null) {
        this._prev = value;
    }

    public get next(): Node<T> | null {
        return this._next;
    }

    public set next(value: Node<T> | null) {
        this._next = value;
    }

    public get value(): T {
        return this._value;
    }

    public set value(value: T) {
        this._value = value;
    }
}

export class LinkedList<T> {
    private _first: Node<T> | null;
    private _last: Node<T> | null;
    private _length: number;

    constructor(value: T | null = null) {
        this._first = null;
        this._last = null;
        this._length = 0;

        if (value) {
            this.pushFront(value);
        }
    }

    public get first(): Node<T> | null {
        return this._first;
    }

    public get last(): Node<T> | null {
        return this._last;
    }

    get length(): number {
        return this._length;
    }

    private getNode(index: number): Node<T> {
        if (index < 0 || index >= this._length) {
            Logger.error("LinkedList", "Index is out of bounds");
            throw new Error("Index is out of bounds");
        }

        if (index <= this._length / 2) {
            let cur = <Node<T>>this._first;
            for (let i = 0; i < index; i++) {
                cur = <Node<T>>cur.next;
            }
            return cur;
        }

        const distance = this._length - index - 1;
        let cur = <Node<T>>this._last;
        for (let i = 0; i < distance; i++) {
            cur = <Node<T>>cur.prev;
        }
        return cur;
    }

    public get(index: number): T {
        return this.getNode(index).value;
    }

    public pushFront(value: T): void {
        const node = new Node(value);

        if (!this._first) {
            this._first = node;
            this._last = node;
        }
        else {
            node.next = this._first;
            this._first.prev = node;
            this._first = node;
        }

        this._length++;
    }

    public pushBack(value: T): void {
        const node = new Node(value);

        if (!this._last) {
            this._first = node;
            this._last = node;
        }
        else {
            node.prev = this._last;
            this._last.next = node;
            this._last = node;
        }

        this._length++;
    }

    public insert(value: T, index: number): void {
        if (index == 0) {
            this.pushFront(value);
            return;
        }
        if (index == this._length) {
            this.pushBack(value);
            return;
        }

        const node = new Node(value);

        const prev = this.getNode(index - 1);
        node.prev = prev;
        node.next = prev.next;

        (<Node<T>>prev.next).prev = node;
        prev.next = node;

        this._length++;
    }

    public popFront(): T {
        if (!this._first) {
            Logger.error("LinkedList", "Nothing to pop");
            throw new Error("Nothing to pop");
        }

        const res = this._first.value;

        this._first = this._first.next;
        if (this._first) {
            this._first.prev = null;
        }
        this._length--;

        if (this._length == 0) {
            this._last = null;
        }

        return res;
    }

    public popBack(): T {
        if (!this._last) {
            Logger.error("LinkedList", "Nothing to pop");
            throw new Error("Nothing to pop");
        }

        const res = this._last.value;

        this._last = this._last.prev;
        if (this._last) {
            this._last.next = null;
        }
        this._length--;

        if (this._length == 0) {
            this._first = null;
        }

        return res;
    }

    public remove(index: number): T {
        if (index == 0) {
            return this.popFront();
        }
        if (index == this._length - 1) {
            return this.popBack();
        }

        const node = this.getNode(index);

        (<Node<T>>node.prev).next = node.next;
        (<Node<T>>node.next).prev = node.prev;
        this._length--;

        return node.value;
    }

    public removes(indexes: number[]): T[] {
        const res: T[] = [];

        // Sorts in reverse order for safe deletion
        indexes.sort((a, b) => b - a);

        // Removes all and pushes on res
        for (const index of indexes) {
            const cur = this.remove(index);
            if (cur !== null) {
                res.push(cur);
            }
        }

        return res;
    }

    public forEach(fct: (value: T, index: number) => void): void {
        let cur = this._first;
        let i = 0;
        while(cur) {
            const next = cur.next;
            fct(cur.value, i);
            cur = next;
            i++;
        }
    }

    public forEachDestroy(fct: (value: T, index: number) => boolean): void {
        let cur = this._first;
        let i = 0;
        const toDestroy = new LinkedList<number>();
        while(cur) {
            const res = fct(cur.value, i);
            cur = cur.next;
            i++;

            if (res) {
                toDestroy.pushBack(i - 1);
            }
        }

        let destroyed = 0;
        toDestroy.forEach((index) => {
            this.remove(index - destroyed);
            destroyed++;
        });
    }

    public print(): void {
        let resF = "";
        let cur = this._first;
        if (cur) {
            resF += cur.value;
            cur = cur.next;
        }
        else {
            resF += "empty";
        }
        while (cur) {
            resF += " -> " + cur.value;
            cur = cur.next;
        }

        let resB = "";
        cur = this._last;
        if (cur) {
            resB += cur.value;
            cur = cur.prev;
        }
        else {
            resB += "empty";
        }
        while (cur) {
            resB += " -> " + cur.value;
            cur = cur.prev;
        }

        console.log(resF);
        console.log(resB);
        console.log(this._length);
    }
}