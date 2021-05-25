/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/log', 'N/record', 'N/transaction','N/ui/dialog'],
/**
 * @param{currentRecord} currentRecord
 * @param{log} log
 * @param{record} record
 * @param{transaction} transaction
 * @param{ui/dialog} dialog
 */
function(currentRecord, log, record, transaction, dialog) {
    
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */

    function pageInit(scriptContext) {
        try{
            let record = scriptContext.currentRecord;
            let objFieldLookUp = search.lookupFields(
                {
                    type : 'classification',
                    id : DEL_SalesChannel,
                    columns :
                        [
                            'custrecord_del_ebaysaleschannel'
                        ]
                });

            //let ebaychannel = objFieldLookUp["custrecord_del_ebaysaleschannel"];
            if(record.getText('custbody_ordertype') == "Customer Collecting"){
                let saleschannels = ["4","5","101","7","8","6","111"];
                if(saleschannels.includes(record.getValue('custbody_itemfulfilment_saleschannel'))){
                    //if (ebaychannel == true) {
                    record.getField('custbody_del_ebaycollectioncode').isDisplay= true;
                    if(record.getText('shipstatus') == "Shipped"){
                        record.getField('custbody_del_ebaycollectioncode').isMandatory = true;
                    }else{
                        record.getField('custbody_del_ebaycollectioncode').isMandatory = false;
                    }
                }else{
                    record.getField('custbody_del_ebaycollectioncode').isDisplay= false;
                    record.getField('custbody_del_ebaycollectioncode').isMandatory = false;
                }
            }else{
                record.getField('custbody_del_ebaycollectioncode').isDisplay= false;
                record.getField('custbody_del_ebaycollectioncode').isMandatory = false;
            }
        }
        catch (e){
            log.error(e.name, e.message);
        }

    }

    /**
     * Function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @since 2015.2
     */
    function fieldChanged(scriptContext) {
        try{
            let record = scriptContext.currentRecord;
            if(record.getText('custbody_ordertype') == "Customer Collecting"){



                let saleschannels = ["4","5","101","7","8","6","111"];
                if(saleschannels.includes(record.getValue('custbody_itemfulfilment_saleschannel'))){



                    record.getField('custbody_del_ebaycollectioncode').isDisplay= true;
                    if(record.getText('shipstatus') == "Shipped"){
                        record.getField('custbody_del_ebaycollectioncode').isMandatory = true;
                    }else{
                        record.getField('custbody_del_ebaycollectioncode').isMandatory = false;
                    }
                }else{
                    record.getField('custbody_del_ebaycollectioncode').isDisplay= false;
                    record.getField('custbody_del_ebaycollectioncode').isMandatory = false;
                }
            }else{
                record.getField('custbody_del_ebaycollectioncode').isDisplay= false;
                record.getField('custbody_del_ebaycollectioncode').isMandatory = false;
            }
        }
        catch (e){
            log.error(e.name, e.message);
        }

    }

    function saveRecord(scriptContext) {
        let record = scriptContext.currentRecord;
        let options = {
            title: 'eBay Collection Reference Error',
            message: 'This Item Fulfillment has an Order Type of "Customer Collecting" for an eBay order.<br/><br/>' +
                'You <b>MUST</b> enter the 6 digit eBay Collection Code provided by the customer when they collect (under the QR Code in their email).<br/><br/>' +
                'If you do not enter this and the customer claims they have not collected the item, we must give the customer a refund out of our own pocket..<br/><br/>' +
                'If you are delivering to the customer instead, please change the Order Type to "To Be Delivered"."'
        };
        // function success(result) {
        //
        // }
        //
        // function failure(reason) {
        //
        // }

        if(record.getText('custbody_ordertype') == "Customer Collecting"){
            let saleschannels = ["4","5","101","7","8","6","111"];
            if(saleschannels.includes(record.getValue('custbody_itemfulfilment_saleschannel'))){
                if(record.getText('shipstatus') == "Shipped"){
                    let ebaycollection = record.getValue('custbody_del_ebaycollectioncode');
                    log.debug(ebaycollection.length);
                    if(ebaycollection.length < 6){
                        dialog.alert(options);
                        return false;
                    }else{
                        return true;
                    }
                }

            }
        }



        return true
    }

    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
        // postSourcing: postSourcing,
        // sublistChanged: sublistChanged,
        // lineInit: lineInit,
        // validateField: validateField,
        // validateLine: validateLine,
        // validateInsert: validateInsert,
        // validateDelete: validateDelete,
        saveRecord: saveRecord
    };
    
});
