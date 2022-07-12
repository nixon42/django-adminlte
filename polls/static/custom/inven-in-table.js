function InvenIn() {
    // TODO:this
    // depend
    // getinventory

    var content = invenInContent;
    var InvenInTableObj = new TableObjTemplate();
    InvenInTableObj.name = 'Inven-In-Table';
    InvenInTableObj.jsgrid = content.find('#inven-in-table-jsgrid');
    InvenInTableObj._content = content.find('#inven-in-table');
    InvenInTableObj.dataUrl = API_URL.inven.getinvenin;
    InvenInTableObj.parseData = false;
    InvenInTableObj.useEditModal = false;
    InvenInTableObj.globalVarUpdateCB = (data) => {
        // console.log(data);
    }
    InvenInTableObj.jsgridConfig = {
        width: '100%',
        sorting: true,
        paging: true,
        srinkToFit: false,
        filtering: true,
        autoload: false,
        editing: false,
        noDataContent: "No Data Found",

        rowClick: function (arg) {
            // console.log(arg);
        },
        rowDoubleClick: (arg) => {

        },
        fields: [
            { type: 'control', editButton: false, deleteButton: false },
            { name: 'id', type: 'number', width: 50, headerTemplate: 'No' },
            { name: 'item.name', type: 'text', width: 150, headerTemplate: 'Item' },
            { name: 'amount', type: 'number', width: 80, headerTemplate: 'Amount' },
            { name: 'fprice', type: 'text', width: 180, headerTemplate: 'Price' },
            { name: 'date', type: 'text', width: 100, headerTemplate: 'Date' },
            { name: 'user.first_name', type: 'text', width: 120, headerTemplate: 'Officer' },
            { name: 'note', type: 'text', width: 200, headerTemplate: 'Note' },
        ],
        controller: {
            loadData: (filter) => {
                // console.log(TeamTableobj.data);
                return $.grep(InvenInTableObj.data, (data) => {
                    return (!filter.id || data.id === filter.id)
                        && (!filter.item.name || data.item.name.toLowerCase().indexOf(filter.item.name.toLowerCase()) > -1)
                        && (!filter.user.first_name || data.user.first_name.toLowerCase().indexOf(filter.user.first_name.toLowerCase()) > -1)
                        && (!filter.date || data.date.toLowerCase().indexOf(filter.date.toLowerCase()) > -1)
                        && (!filter.note || data.note.toLowerCase().indexOf(filter.note.toLowerCase()) > -1)
                });

            }
        },
    };
    InvenInTableObj.init();

    // form
    var form = content.find("div.inven-in-form");
    var submitBtn = form.find("button.submit-btn");
    var inputDom = {
        item: form.find("select.input-inven-item-select"),
        amount: form.find("input.input-amount"),
        price1: form.find("input.input-price-1"),
        total: form.find("input.input-price-total"),
        note: form.find("textarea.input-note"),
    };

    inputDom.price1.on('input', () => {
        inputDom.total.inputmask('setvalue', $(this).inputmask('unmaskvalue') * inputDom.amount.val());
    });
    submitBtn.on('click', () => {
        console.log(inputDom.price1.inputmask('unmaskedvalue'));
    })
}