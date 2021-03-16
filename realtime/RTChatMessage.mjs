import RTMessage from "./RTMessage.mjs";


export default class RTChatMessage extends RTMessage {
    /**
     * chat message object
     * @constructor
     * @param  {String} source
     * @param  {String} sourceType
     * @param  {Date} creatorTimestamp
     * @param  {any} message
     * @param  {Date} serverTimestamp
     * @param  {Number} room
     */
    constructor(source, sourceType, creatorTimestamp, message, serverTimestamp, room) {
        super(source, sourceType, creatorTimestamp);
        this.addPrintableProp("message", message);
        this.addPrintableProp("serverTimestamp", serverTimestamp);
        this.addPrintableProp("room", room);
    }
}
