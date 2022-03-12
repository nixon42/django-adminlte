class ModalObjTemplate {
    constructor() {
        this.name;
        this.table;
        this.insertUrl;
        this.modal;
        this.input;
        this.defaultVal;
        this.inputDom = {};
        this.loadDataCB = null;
    }
    set_prop(key, val) {
        this[key] = val;
    }
    init() {
        console.log(`[${this.name}] init`);
        if (this.input == null || this.modal == null || this.table == null) {
            console.log(`[${this.name}]Set input, modal, and table first`);
            return;
        }

        let _inputDom = this.inputDom;
        let _modal = $(this.modal);

        $.each(this.input, function (key, val) {
            $.extend(true, _inputDom, {
                [key]: _modal.find(val),
            });
        });
        // console.log(this.inputDom.name);
    }
    save() {
        console.log(`[${this.name}] save`);
        let data = {};
        if (this.selectedItem != null) {
            data.pk = this.selectedItem.pk;
        }
        $.each(this.inputDom, (key, val) => {
            data[key] = val.val();
        });

        $.ajax({
            url: this.insertUrl,
            data: data,
            dataType: 'json',
            method: 'POST',
            beforeSend: (req) => { req.setRequestHeader('X-CSRFToken', csrftoken); },
        }).fail(() => {
            toastr.error('failed to insert data')
        }).done((res) => {
            if (res.return_code != 0) { toastr.error(`failed, reason ${res.msg}`); return; }
            toastr.success('Ok')
            this.modal.modal('hide');
            this.loadDataCB();
        });
    }
    showNew() {
        console.log(`[${this.name}] show new`);
        let $this = this;
        $.each(this.inputDom, (key, val) => {
            val.val('');
        });
        $.each(this.defaultVal, (key, val) => {
            $this.inputDom[key].val(val);
        });
        this.modal.modal();
    }
    show(item) {
        this.selectedItem = item;
        console.log(`[${this.name}] showing data`);
        // console.log(item);
        // console.log(data);

        $.each(this.inputDom, function (key, val) {
            val.val(item.fields[key]);
        });
        this.modal.modal();
    }
    hide() {
        console.log(`[${this.name}] hide`);
        this.modal.modal('hide');
    }
}

$.fn.log = function () {
    console.log.apply(console, this);
    return this;
};

class TableObjTemplate {
    // TODO: this refresh
    constructor() {
        this.name;
        this._content;
        this.data = [];
        this.dataUrl;
        this.jsgrid;
        this.jsgridConfig;
        this.modal;
        this.modalInput;
        this.modalDefaultVal;
        this.insertUrl;
        this.modalObj;
        this.modalSel;
        this.selected = null;
        this.selectedItem = null;
        this.globalVarUpdateCB = (item) => { };
    }
    refreshData() {
        console.log(`[${this.name}] refresh data`);
        $.ajax({
            url: this.dataUrl,
            method: 'GET',
            async: false,
            dataType: 'json',
        }).fail(() => {
            toastr.error(`failed to get data for ${this.name}`);
        }).done((res) => {
            toastr.success(`done load data ${this.name}`);
            this.data = JSON.parse(res.data);
            // console.log(this.data);
        }).always(() => {
            $(this.jsgrid).jsGrid('loadData');
            this.globalVarUpdateCB(this.data);
        });
    }
    showItem() {
        this.modalObj.show(this.selectedItem);
    }
    init() {
        console.log(`[${this.name}] init ...`);
        let _modalObj = new ModalObjTemplate();
        _modalObj.name = `${this.name}Modal`
        _modalObj.table = this.jsgrid;
        _modalObj.insertUrl = this.insertUrl;
        _modalObj.input = this.modalInput;
        _modalObj.defaultVal = this.defaultVal;
        _modalObj.modal = this.modalSel;
        _modalObj.loadDataCB = this.refreshData.bind(this);
        _modalObj.init();
        this.modalObj = _modalObj;
        // console.log(this.jsgrid);
        // console.log(this.jsgridConfig);
        $(this.jsgrid).jsGrid(this.jsgridConfig);
        this.refreshData();
        $(this.jsgrid).jsGrid('loadData');
        this.refreshBtn = $(this._content).find('.tool-btn-refresh');
        this.addBtn = this._content.find('.tool-btn-add');
        this.editBtn = this._content.find('.tool-btn-edit')

        // console.log(this.refreshBtn);
        this.refreshBtn.click(this.refreshData.bind(this));
        this.addBtn.click(this.modalObj.showNew.bind(this.modalObj));
        this.editBtn.click(this.showItem.bind(this));
        this.modalSel.find('.modal-save-btn').click(this.modalObj.save.bind(this.modalObj));
        // this.addBtn.click(this.modalObj.showNew.bind(this.modalObj))
    }
}

function inventoryContent() {
    var content = $('#inventory-content');
    var InventoryType = new TableObjTemplate();
    InventoryType.name = 'InventoryType';
    // InventoryType.data = InventoryTypeData;
    InventoryType.jsgrid = content.find('#inventory-type-table-jsgrid');
    InventoryType._content = content.find('#inventory-type-table');
    InventoryType.modalSel = content.find('.inventory-type-modal');
    InventoryType.globalVarUpdateCB = (data) => {
        INVEN_TYPE_DATA = data;
        $('.input-inven-t').empty();
        $('.input-inven-t').append('<option val="0"></option>');
        $.each(InventoryType.data, (key, val) => {
            $('.input-inven-t').append(`<option val="${val.pk}">${val.fields.name}</option>`);
        });
    };
    // InventoryType.inputOptDom = '.input-inven-t';
    InventoryType.dataUrl = '/getinvent';
    InventoryType.insertUrl = '/addinvent';
    InventoryType.modalInput = {
        name: '.input-name',
    };
    InventoryType.jsgridConfig = {
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
            // let $row = InventoryType.jsgrid.rowByItem(arg.item);
            let $row = InventoryType.jsgrid.find('.jsgrid-selected-row');
            if ($row.hasClass("highlight")) {
                $row.toggleClass("highlight");
                InventoryType.editBtn.addClass("d-none");
                InventoryType.selected = null;
                return
            }
            if (InventoryType.selected != null) { InventoryType.selected.toggleClass("highlight"); }
            $row.toggleClass("highlight");
            InventoryType.selected = $($row);
            InventoryType.selectedItem = arg.item;
            InventoryType.editBtn.removeClass("d-none");
        },
        fields: [
            // { type: 'control', width: 40, editButton: false, deleteButton: false },
            { name: 'pk', type: 'number', width: 50, headerTemplate: 'No' },
            { name: 'fields.name', type: 'text', width: 150, headerTemplate: 'Name' },
        ],
        controller: {
            loadData: (filter) => {
                return $.grep(InventoryType.data, (data) => {
                    return (!filter.pk || data.pk === filter.pk)
                        && (!filter.fields.name || data.fields.name.indexOf(filter.fields.name) > -1)
                });
            }
        },
    };
    InventoryType.init();

    var Inventory = new TableObjTemplate();
    Inventory.name = 'Inventory';
    Inventory.jsgrid = content.find('#inventory-table-jsgrid');
    Inventory._content = content.find('#inventory-table');
    Inventory.modalSel = content.find('.inventory-modal');
    Inventory.dataUrl = '/getinven';
    Inventory.insertUrl = '/addinven';
    Inventory.globalVarUpdateCB = (data) => {
        let search = {
            'Router': { selector: '.input-router', variable: INVEN_ROUTER },
            'Converter': { selector: '.input-converter', variable: INVEN_KONVERTER }
        };
        $.each(search, (key, val) => {
            val.variable = [];
            $(val.selector).empty();
            $(val.selector).append('<option val="0"></option>');
            // console.log(INVEN_TYPE_DATA);
            $.each(INVEN_TYPE_DATA, (_key, _type) => {
                if (_type.fields.name == key) {
                    // console.log(data);
                    let _inven = $.map(data, (inven_val, inven_key) => {
                        if (inven_val.fields.type = _type.pk) {
                            return inven_val;
                        }
                    });
                    val.variable = _inven;
                    $.each(_inven, (_, v) => {
                        $(val.selector).append(`<option val="${v.pk}}">${v.fields.name}</option>`);
                    });
                }
            });
        });
    };
    Inventory.modalInput = {
        name: '.input-name',
        stock: '.input-stock',
        type: '.input-inven-t'
    };
    Inventory.jsgridConfig = {
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
            let $row = Inventory.jsgrid.find('.jsgrid-selected-row');
            if ($row.hasClass("highlight")) {
                $row.toggleClass("highlight");
                Inventory.editBtn.addClass("d-none");
                Inventory.selected = null;
                return
            }
            if (Inventory.selected != null) { Inventory.selected.toggleClass("highlight"); }
            $row.toggleClass("highlight");
            Inventory.selected = $($row);
            Inventory.selectedItem = arg.item;
            Inventory.editBtn.removeClass("d-none");
        },
        fields: [
            { type: 'control', with: 40, editButton: false, deleteButton: false },
            { name: 'pk', type: 'number', width: 50, headerTemplate: 'No' },
            { name: 'fields.name', type: 'text', width: 200, headerTemplate: 'Name' },
            { name: 'fields.type', type: 'select', items: INVEN_TYPE_DATA, width: 150, headerTemplate: 'Type', valueField: 'pk', textField: 'fields.name' }
        ],
        controller: {
            loadData: (filter) => {
                // console.log(filter);
                console.log(`[${Inventory.name}] Load data`);
                return $.grep(Inventory.data, (data) => {
                    return (!filter.pk || data.pk === filter.pk)
                        && (!filter.fields.name || data.fields.name.indexOf(filter.fields.name) > -1)
                        && (!filter.fields.type || data.fields.type === filter.fields.type)
                });
            },
        },
    };
    Inventory.init();
    Inventory.jsgrid.find('.jsgrid-filter-row').children().eq(3).children().addClass('input-inven-t');
    InventoryType.globalVarUpdateCB(InventoryType.data);
}
