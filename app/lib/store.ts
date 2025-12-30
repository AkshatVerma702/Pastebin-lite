const store = new Map<string, string>();

export function savePaste(id: string, content: string){
    store.set(id, content)
}

export function getPaste(id: string){
    return store.get(id)
}