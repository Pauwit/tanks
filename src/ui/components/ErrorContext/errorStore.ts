type ErrorMessage = { id: number; text: string };
type Listener = (messages: ErrorMessage[]) => void;

let idCounter = 0;
let listeners: Listener[] = [];
let messages: ErrorMessage[] = [];

export function showError(...args: unknown[]) {
    const text = args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ');

    const id = ++idCounter;
    const message = { id, text };
    messages = [...messages, message];
    emit();

    setTimeout(() => {
        messages = messages.filter((m) => m.id !== id);
        emit();
    }, 5000);
}

function emit() {
    for (const listener of listeners) {
        listener(messages);
    }
}

export function subscribe(listener: Listener) {
    listeners.push(listener);
    listener(messages); // initial emit

    return () => {
        listeners = listeners.filter((l) => l !== listener);
    };
}
