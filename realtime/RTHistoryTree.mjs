import RTMessage from "./RTMessage.mjs";

export default class RTTreeMessage extends RTMessage {
    /**
    * tree message object
    * @constructor
    * @param  {String} source
    * @param  {String} sourceType
    * @param  {Date} creatorTimestamp
    * @param  {RTTreeMessage} parent
    */
    constructor(value, source, sourceType, creatorTimestamp, parent) {
        super(source, sourceType, creatorTimestamp); // must call this first
        this.addPrintableProp("parent", parent); // call this to add a printable prop
        this.addPrintableProp("value", value);
    }
}
