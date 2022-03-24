var AP_DATA = [];
var SELECT_AP_DATA = [
    {},
    { code: 'asu', name: 'gatel' }
];
var INVEN_TYPE_DATA = [
    { pk: 1, name: '1cok' },
    { pk: 2, name: '2cok' },
    { pk: 3, name: '3cok' },
]
var INVEN_ROUTER = [{ pk: 0, name: 'asu' }]
var INVEN_KONVERTER = [{ pk: 0, name: 'asu' }]
var CONTENT_INIT = {
    AP_INIT: false,
    INVEN_INIT: false,
    AREA_INIT: false,
    NETWATCH_INIT: false,
    MONTHLY_CUSTOMER: false,
    table: {}
}
var AREA = [{ pk: 0, name: 'cok', code: 'asu' }]
var NETWATCH_DATA = [{}]

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
        this.cloneBtn = null;
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
    save(opt = null) {
        console.log(`[${this.name}] save`);
        let data = {};
        if (this.selectedItem != null && opt != 'clone') {
            data.pk = this.selectedItem.pk;
        }
        $.each(this.inputDom, (key, val) => {
            data[key] = val.val();
        });

        // console.log(this.inputDom.type.find(':selected').data('val'));

        $.ajax({
            url: this.insertUrl,
            data: data,
            dataType: 'json',
            method: 'POST',
            beforeSend: (req) => { req.setRequestHeader('X-CSRFToken', csrftoken); },
        }).fail(() => {
            toastr.error('failed to insert data')
        }).done((res) => {
            if (res.return_code != 0) { toastr.error(`failed, ${res.msg}`); return; }
            toastr.success('Ok')
            this.modal.modal('hide');
            this.loadDataCB();
        });
    }
    showNew() {
        console.log(`[${this.name}] show new`);
        let $this = this;
        $.each(this.inputDom, (key, val) => {
            if (val.is('select')) { val.val(0).change(); return; }
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
            if (val.is('select')) {
                val.val(item.fields[key]).change();
                // val.val(item.fields.key).trigger('change');
                return;
            }
            val.val(item.fields[key]);
        });
        console.log($(this.cloneBtn).log());
        this.cloneBtn.removeClass('d-none');
        this.modal.modal();
    }
    hide() {
        console.log(`[${this.name}] hide`);
        this.cloneBtn.addClass('d-none');
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
        this.useEditModal = true;
        this.selected = null;
        this.selectedItem = null;
        this.globalVarUpdateCB = (item) => { };
        this.showMore = (arg) => { };
        this.editBtn = null;
    }
    refreshData() {
        console.log(`[${this.name}] refresh data`);
        // this.modalSel.find('.tool-btn-edit').addClass('d-none');
        if (this.editBtn != null) {
            this.editBtn.addClass('d-none');
        }
        this.selected = null;
        this.selectedItem = null;
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
    showMore() {
        this.showMore(this.selectedItem);
    }

    init() {
        console.log(`[${this.name}] init ...`);
        if (this.useEditModal) {
            let _modalObj = new ModalObjTemplate();
            _modalObj.name = `${this.name} Modal`
            _modalObj.table = this.jsgrid;
            _modalObj.insertUrl = this.insertUrl;
            _modalObj.input = this.modalInput;
            _modalObj.defaultVal = this.defaultVal;
            _modalObj.modal = this.modalSel;
            _modalObj.cloneBtn = this.modalSel.find('.modal-clone-btn');
            _modalObj.loadDataCB = this.refreshData.bind(this);
            _modalObj.init();
            this.modalObj = _modalObj;

            this.modalSel.on('hidden.bs.modal', () => {
                this.cloneBtn.addClass('d-none');
            });

            // modal btn
            var _modalSave = this.modalObj.save.bind(this.modalObj);
            this.modalSel.find('.modal-save-btn').click(() => { _modalSave() });
            this.modalSel.find('.modal-clone-btn').click(() => { _modalSave('clone'); });

            // add btn
            this.addBtn = this._content.find('.tool-btn-add');
            this.addBtn.click(this.modalObj.showNew.bind(this.modalObj));
            this.editBtn = this._content.find('.tool-btn-edit');
            this.editBtn.click(this.showItem.bind(this));
        }
        // console.log(this.jsgrid);
        // console.log(this.jsgridConfig);
        $(this.jsgrid).jsGrid(this.jsgridConfig);
        this.refreshData();
        $(this.jsgrid).jsGrid('loadData');
        this.refreshBtn = $(this._content).find('.tool-btn-refresh');

        // console.log(this.refreshBtn);
        this.refreshBtn.click(this.refreshData.bind(this));
    }
}

