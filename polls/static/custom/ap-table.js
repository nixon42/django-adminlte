var accessPointModal = {
    optData: [],
    inputDom: {},
    selectedItem: null,
    modal: null,
    input: null,
    table: null,

    init: function () {
        if (this.input == null || this.modal == null || this.table == null) {
            console.log('Set input, modal, and table first');
            return;
        }

        let _inputDom = this.inputDom;
        let _modal = this.modal;

        $.each(this.input, function (key, val) {
            $.extend(true, _inputDom, {
                [key]: _modal.find(val),
            });
        });

        this.modal.on('hidden.bs.modal', () => {
            this.modal.find('.ap-table-modal-clone').addClass('d-none');
        });

    },
    refreshOpt: function () {
        let arr = [
            $(this.inputDom.linka),
            $(this.inputDom.linka2),
            $(this.inputDom.linkb),
            $(this.inputDom.linkb2)]

        $.each(arr, (key, val) => {
            val.empty();
            val.append('<option val=""></option>');
        });

        $.each(this.optData, (key, val) => {
            $.each(arr, (key, _val) => {
                _val.append(`<option val="${val}">${val}</option>`);
            });
        });
    },
    save: function (opt = '') {
        console.log('save modal');
        let newApData = {};
        let $this = this;
        if (this.selectedItem != null && opt != 'clone') {
            console.log('get pk');
            newApData.pk = this.selectedItem.pk;
        }
        $.each(this.inputDom, function (key, val) {
            if ($(val).is(':checkbox')) {
                newApData[key] = val.is(':checked');
                // console.log(newApData[key]);
                return;
            }
            newApData[key] = val.val();
        });
        let _data = {
            item: newApData,
            success: function () {
                $this.hide();
                $this.selectedItem = null;
                $($this.table).jsGrid('refreshData');
            },
            fail: () => { },
        };
        $(this.table).jsGrid('insertItem', _data);
        // this.selectedItem = null;
        // if (!this.table.jsGrid('insertItem', newApData)) {
        //     console.log('here');
        // }
    },
    defaultVal: {},
    new: function () {
        this.selectedItem = null;
        let inputDom = this.inputDom;
        $.each(this.inputDom, function (key, val) {
            if (key == 'date') { return; }
            if (val.is('checkbox')) { val.prop('checked', 'false'); return; }
            if (val.is('select')) { val.val(0).change(); return; }
            val.val('');
        });
        $.each(this.defaultVal, function (key, val) {
            inputDom[key].val(val);
        });
        this.inputDom.area.removeAttr('disabled');
        this.inputDom.rt.removeAttr('disabled');
        this.inputDom.rw.removeAttr('disabled');
        this.modal.modal();
    },
    show: function (data) {
        this.selectedItem = data;
        console.log('showing data');
        // console.log(data);

        $.each(this.inputDom, function (key, val) {
            if (val.is('select')) {
                val.val(data.fields[key]).change();
                return;
            }
            if (val.is(':checkbox')) { val.prop('checked', data.fields[key]); return; };
            val.val(data.fields[key]);
        });
        this.inputDom.area.attr('disabled', 'disabled');
        this.inputDom.rt.attr('disabled', 'disabled');
        this.inputDom.rw.attr('disabled', 'disabled');
        this.modal.find('.ap-table-modal-clone').removeClass('d-none');
        this.modal.modal();
    },
    hide: function () {
        this.modal.modal('hide');
    },
}

function accessPointTable() {
    var jsgrid = $("#ap-table-jsgrid");
    var selected = null;
    var selectedItem = null;
    var editBtn = $(".ap-table-tool-btn-edit");

    var data_ap = [
        {
            "no": 0,
            "Code": "MJT2310IE00",
            "IP": "192.168.8.1",
            "Customer": "David",
            "Long": "-7777.1231",
            "Lat": "12378.1236",
            "Wifi": "RT NET",
            "Indoor": true,
            // "Type": "",
            "Date": "22/3/2022",
            "Area": 1,
            "RT": 1,
            "RW": 1,
            "FO": true,
            "Link": "",
            "Router": 1,
            "FO2LAN": 1,
            // "Pic": "",
            "Note": ""
        },
        {
            "No": 1,
            "Code": "MJT2310IE00",
            "IP": "192.168.8.1",
            "Customer": "David",
            "Long": "-7777.1231",
            "Lat": "12378.1236",
            "Wifi": "RT NET",
            "Indoor": true,
            // "Type": "",
            "Date": "22/3/2022",
            "Area": 1,
            "RT": 1,
            "RW": 1,
            "FO": true,
            "Link": "",
            "Router": 2,
            "FO2LAN": 2,
            // "Pic": "",
            "Note": ""
        },
        {
            "No": 2,
            "Code": "MJT2310IE00",
            "IP": "192.168.8.1",
            "Customer": "David",
            "Long": "-7777.1231",
            "Lat": "12378.1236",
            "Wifi": "RT NET",
            "Indoor": true,
            // "Type": "",
            "Date": "22/3/2022",
            "Area": 1,
            "RT": 1,
            "RW": 1,
            "FO": true,
            "Link": "",
            "Router": 3,
            "FO2LAN": 2,
            // "Pic": "",
            "Note": ""
        },
    ];

    jsgrid.jsGrid({
        // height: "100%", 
        width: "100%",
        refreshData: function () {
            console.log('refresh AP Data');
            editBtn.addClass("d-none");
            selected = null;
            selectedItem = null;
            $.ajax({
                url: '/getap',
                dataType: 'json',
                // async: false,
                method: 'GET',

            }).done(function (result) {
                // console.log('done /getap');
                if (result.return_code != 0) {
                    toastr.error(`${result.return_code} : ${result.msg}`);
                    return;
                }
                // console.log(result.data);
                let _data_ap = JSON.parse(result.data);
                // console.log(data_ap[0]);

                // this.loadData();
                SELECT_AP_DATA = [''];
                $.each(_data_ap, function (key, val) {
                    // console.log(val.fields.code);
                    $.each(NETWATCH_DATA, (key, nwval) => {
                        if (nwval.pk == val.fields.up) {
                            val.fields.up_data = nwval.fields.up;
                        }
                    });
                    SELECT_AP_DATA.push(`${val.fields.code} - ${val.fields.customer}`);
                });
                data_ap = _data_ap;
                AP_DATA = _data_ap;
                accessPointModal.optData = SELECT_AP_DATA;
                accessPointModal.refreshOpt();
                if (CONTENT_INIT.table.netwatch != undefined) {
                    CONTENT_INIT.table.netwatch.refreshData();
                }
            }).fail(function () {
                data_ap = [];
                toastr.error('failed to load ap data');
            }
            ).always(function () {
                // console.log('always /getap');
                jsgrid.jsGrid('loadData');
                // this.loadData();
            });
        },
        controller: {
            loadData: function (filter) {
                // console.log(filter);
                console.log('load Data');
                return $.grep(data_ap, function (data) {
                    return (!filter.pk || data.pk === filter.pk)
                        && (!filter.fields.code || data.fields.code.toLowerCase().indexOf(filter.fields.code.toLowerCase()) > -1)
                        && (!filter.fields.ip || data.fields.ip.indexOf(filter.fields.ip) > -1)
                        && (filter.fields.up_data === undefined || data.fields.up_data === filter.fields.up_data)
                        && (!filter.fields.customer || data.fields.customer.toLowerCase().indexOf(filter.fields.customer.toLowerCase()) > -1)
                        && (!filter.fields.phone || data.fields.phone.indexOf(filter.fields.phone) > -1)
                        && (!filter.fields._long || data.fields._long.indexOf(filter.fields._long) > -1)
                        && (!filter.fields.lat || data.fields.lat.indexOf(filter.fields.lat) > -1)
                        && (!filter.fields.wifi || data.fields.wifi.indexOf(filter.fields.wifi) > -1)
                        && (filter.fields.outdoor === undefined || data.fields.outdoor === filter.fields.outdoor)
                        && (!filter.fields.date || data.fields.date.indexOf(filter.fields.date) > -1)
                        && (!filter.fields.area || data.fields.area === filter.fields.area)
                        && (!filter.fields.rt || data.fields.rt === filter.fields.rt)
                        && (!filter.fields.rw || data.fields.rw === filter.fields.rw)
                        && (filter.fields.fo === undefined || data.fields.fo === filter.fields.fo)
                        && (!filter.fields.linka || data.fields.linka.toLowerCase().indexOf(filter.fields.linka.toLowerCase()) > -1)
                        && (!filter.fields.linnkb || data.fields.linnkb.toLowerCase().indexOf(filter.fields.linnkb.toLowerCase()) > -1)
                        && (!filter.fields.linkb2 || data.fields.linkb2.toLowerCase().indexOf(filter.fields.linkb2.toLowerCase()) > -1)
                        && (!filter.fields.linka2 || data.fields.linka2.toLowerCase().indexOf(filter.fields.linka2.toLowerCase()) > -1)
                        && (!filter.fields.router || data.fields.router === filter.fields.router)
                        && (!filter.fields.converter || data.fields.converter === filter.fields.converter)
                        && (!filter.fields.note || data.fields.note.toLowerCase().indexOf(filter.fields.note.toLowerCase()) > -1)
                });
            },
            insertItem: function (_item) {
                let item = _item.item;
                console.log('insert to /addap');
                // log
                $.ajax({
                    url: '/addap',
                    beforeSend: function (req) {
                        req.setRequestHeader("X-CSRFToken", csrftoken);
                    },
                    method: 'POST',
                    data: item,
                    dataType: 'json',
                }).fail(function () {
                    console.log('failed /addap');
                    toastr.error('failed to insert data');
                    _item.fail();
                }).done(function (result) {
                    console.log('done /addap');
                    if (result.return_code != 0) {
                        toastr.error(`Failed ${result.return_code} : ${result.msg}`);
                        _item.fail();
                        return;
                    }
                    toastr.success('ok');
                    _item.success();
                });
            },
        },
        sorting: true,
        paging: true,
        srinkToFit: false,
        filtering: true,
        autoload: false,
        editing: false,
        noDataContent: "No Data Found",
        getSelected: function () {
            return selectedItem;
        },
        rowClick: function (arg) {
            // console.log(arg);
        },
        rowDoubleClick: function (arg) {
            let $row = this.rowByItem(arg.item);
            // console.log(arg.item);
            if ($row.hasClass("highlight")) {
                $row.toggleClass("highlight");
                editBtn.addClass("d-none");
                selected = null;
                selectedItem = null;
                return
            }
            if (selected != null) { selected.toggleClass("highlight"); }
            $row.toggleClass("highlight");
            selected = $($row);
            selectedItem = arg.item;
            editBtn.removeClass("d-none");
        },
        fields: [
            { type: 'control', editButton: false, deleteButton: false },
            { name: "pk", type: "number", width: 80, headerTemplate: 'No' },
            { name: "fields.code", type: "text", width: 150, headerTemplate: 'Code' },
            { name: "fields.ip", type: "text", width: 200, headerTemplate: 'IP Addr' },
            { name: "fields.up_data", type: "checkbox", width: 100, headerTemplate: 'Status(UP)' },
            { name: "fields.customer", type: "text", width: 200, headerTemplate: 'Customer' },
            { name: "fields.phone", type: "text", width: 150, headerTemplate: 'Phone' },
            { name: "fields._long", type: "text", width: 200, headerTemplate: 'Longatitude' },
            { name: "fields.lat", type: "text", width: 200, headerTemplate: 'Latitude' },
            { name: "fields.wifi", type: "text", width: 100, headerTemplate: 'Wifi Name' },
            { name: "fields.outdoor", type: "checkbox", width: 80, headerTemplate: 'Outdoor' },
            { name: "fields.date", type: "text", width: 100, headerTemplate: 'Install Date' },
            { name: "fields.area", type: "select", width: 100, headerTemplate: 'Area', items: AREA, valueField: "pk", textField: "code" },
            { name: "fields.rt", type: "number", width: 100, headerTemplate: 'RT' },
            { name: "fields.rw", type: "number", width: 100, headerTemplate: 'RW' },
            { name: "fields.fo", type: "checkbox", width: 60, headerTemplate: 'FO' },
            { name: "fields.linka", type: "text", width: 300, headerTemplate: 'Link A' },
            { name: "fields.linkb", type: "text", width: 300, headerTemplate: 'Link B' },
            { name: "fields.linka2", type: "text", width: 300, headerTemplate: 'Link A2' },
            { name: "fields.linkb2", type: "text", width: 300, headerTemplate: 'Link B2' },
            { name: "fields.router", type: "select", width: 200, headerTemplate: 'Router', items: INVEN_ROUTER, valueField: "pk", textField: "name" },
            { name: "fields.converter", type: "select", width: 200, headerTemplate: 'Converter', items: INVEN_KONVERTER, valueField: "pk", textField: "name" },
            { name: "fields.note", type: "text", width: 200, headerTemplate: 'Note' },
        ],
    });
    // $("#content #ap-table-jsgrid").jsGrid('refreshData');
    // $("#content #ap-table-jsgrid").jsGrid('loadData');
}

// ap table tool
// edit btn
$DOM.on('click', ".ap-table-tool-btn-edit", function () {
    console.log('ap table edit clicked');
    accessPointModal.show($("#content #ap-table-jsgrid").jsGrid('getSelected'));
    // console.log($("#content #ap-table-jsgrid").jsGrid('getSelected'));
});
// add btn
$DOM.on("click", ".ap-table-tool-btn-add", function () {
    console.log('aptable add clicked');
    accessPointModal.new();
    // apTableModal.modal();
});
// refresh btn
$DOM.on("click", ".ap-table-tool-btn-refresh", function () {
    console.log('ap table refresh clicked');
    $("#content #ap-table-jsgrid").jsGrid('refreshData');
    // $("#content #ap-table-jsgrid").jsGrid('loadData');
});

// ap-table modal
$DOM.on('click', '.ap-table-modal-save', function () {
    accessPointModal.save();
    $("#content #ap-table-jsgrid").jsGrid('loadData');
});

$DOM.on('click', '.ap-table-modal-clone', function () {
    accessPointModal.save('clone');
    $("#content #ap-table-jsgrid").jsGrid('loadData');
});