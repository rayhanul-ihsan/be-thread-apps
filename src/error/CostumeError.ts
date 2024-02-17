
export default class CostumeError extends Error{
    status : number
    constructor(status: number, message: string){
        super(message)
        this.status=status
    }
}