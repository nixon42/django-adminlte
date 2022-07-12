function TeamTable() {
    // getrole();
    var content = $('#team-table-content');
    var TeamTableobj = new TableObjTemplate();
    TeamTableobj.name = 'Team-Table';
    TeamTableobj.jsgrid = content.find('#team-table-jsgrid');
    TeamTableobj._content = content.find('#team-table');
    // TeamTableobj.modalSel = content.find('.team-table-modal');
    TeamTableobj.useEditModal = false;
    TeamTableobj.dataUrl = API_URL.team.getUser;
    TeamTableobj.insertUrl = API_URL.team.addUser;
    TeamTableobj.parseData = false;
    TeamTableobj.dataPreProcess = (data) => {
        // console.log(data);
        return $.map(data, (d) => {
            return {
                pk: d.id,
                fields: {
                    firstname: d.first_name,
                    lastname: d.last_name,
                    username: d.username,
                    role: d.role
                }
            };
        });
        // console.log(dat);
    };
    TeamTableobj.globalVarUpdateCB = (data) => {
        // console.log(data);
        TEAM = data;
    };
    TeamTableobj.modalInput = {
        firstName: '.input-first-name',
        lastName: '.input-last-name',
        username: '.input-username',
        password: '.input-password',

    };
    TeamTableobj.jsgridConfig = {
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
            let $row = TeamTableobj.jsgrid.find('.jsgrid-selected-row');
            if ($row.hasClass("highlight")) {
                $row.toggleClass("highlight");
                TeamTableobj.editBtn.addClass("d-none");
                TeamTableobj.selected = null;
                TeamTableobj.selectedItem = null;
                return
            }
            if (TeamTableobj.selected != null) { TeamTableobj.selected.toggleClass("highlight"); }
            $row.toggleClass("highlight");
            TeamTableobj.selected = $($row);
            TeamTableobj.selectedItem = arg.item;
            // console.log(arg.item);
            showUser(arg.item);
            // TeamTableobj.editBtn.removeClass("d-none");
        },
        fields: [
            // { type: 'control', width: 40, editButton: false, deleteButton: false },
            { name: 'pk', type: 'number', width: 50, headerTemplate: 'No' },
            { name: 'fields.firstname', type: 'text', width: 150, headerTemplate: 'First Name' },
            { name: 'fields.lastname', type: 'text', width: 150, headerTemplate: 'Last Name' },
            { name: 'fields.username', type: 'text', width: 100, headerTemplate: 'Username' },
            { name: 'fields.role.id', type: 'select', width: 100, headerTemplate: 'Role', items: ROLE, valueField: 'id', textField: 'name' },
        ],
        controller: {
            loadData: (filter) => {
                // console.log(TeamTableobj.data);
                return $.grep(TeamTableobj.data, (data) => {
                    return (!filter.pk || data.pk === filter.pk)
                        && (!filter.fields.firstname || data.fields.firstname.toLowerCase().indexOf(filter.fields.firstname.toLowerCase()) > -1)
                        && (!filter.fields.lastname || data.fields.lastname.toLowerCase().indexOf(filter.fields.lastname.toLowerCase()) > -1)
                        && (!filter.fields.username || data.fields.username.toLowerCase().indexOf(filter.fields.username.toLowerCase()) > -1)
                        && (!filter.fields.role.id || data.fields.role.id === filter.fields.role.id)
                });
            }
        },
    };
    // getrole();
    TeamTableobj.init();

    var RoleTableObj = new TableObjTemplate();
    RoleTableObj.name = 'Role-Table';
    RoleTableObj.jsgrid = content.find('#role-table-jsgrid');
    RoleTableObj._content = content.find('#role-table');
    RoleTableObj.useEditModal = false;
    RoleTableObj.dataUrl = API_URL.team.getRole;
    RoleTableObj.parseData = false;
    // RoleTableObj.dataPreProcess = () => { };
    RoleTableObj.globalVarUpdateCB = (data) => {
        // console.log(data);
        ROLE = data;
        $('.input-role-select').empty();
        $.each(data, (i, v) => {
            $('.input-role-select').append(`<option value=${v.id}>${v.name}</option>`);
        });
    };

    RoleTableObj.jsgridConfig = {
        width: '100%',
        sorting: true,
        paging: true,
        srinkToFit: false,
        filtering: false,
        autoload: false,
        editing: false,
        noDataContent: "No Data Found",
        fields: [
            // { type: 'control', width: 40, editButton: false, deleteButton: false },
            { name: 'id', type: 'number', width: 30, headerTemplate: 'No' },
            { name: 'name', type: 'text', width: 100, headerTemplate: 'Name' },
            { name: 'member', type: 'number', width: 50, headerTemplate: 'Member' },

        ],
        controller: {
            loadData: (filter) => {
                return $.grep(RoleTableObj.data, (data) => {
                    return (!filter.id || data.id === filter.id)
                        && (!filter.name || data.name.toLowerCase().indexOf(filter.name.toLowerCase()) > -1)
                        && (!filter.member || data.member === filter.member)
                });
            }
        },
    };
    RoleTableObj.init();

    var registerForm = content.find('.register-form');
    var submitBtn = registerForm.find('button.submit-btn');
    var showUser = (item) => {
        inputDom.firstname.val(item.fields.firstname);
        inputDom.lastname.val(item.fields.lastname);
        inputDom.username.val(item.fields.username);
        inputDom.role.val(item.fields.role.id).trigger('change');
    };
    var resetForm = () => {
        $.each(inputDom, (i, el) => {
            el.val("");
        });
    };

    var inputDom = {
        firstname: registerForm.find('.input-first-name'),
        lastname: registerForm.find('.input-last-name'),
        username: registerForm.find('.input-username'),
        role: registerForm.find('.input-role-select'),
        passwd: registerForm.find('.input-password'),
        confirmpasswd: registerForm.find('.input-confirm-password'),
    };
    submitBtn.on('click', () => {
        var data = {};
        $.each(inputDom, (k, v) => {
            data[k] = v.val();
        });
        // console.log(TeamTableobj.selectedItem);
        data.new = TeamTableobj.selectedItem == null;
        console.log(data);
        if (data.passwd != data.confirmpasswd) {
            toastr.error('password failed');
            inputDom.passwd.addClass('is-invalid');
            inputDom.confirmpasswd.addClass('is-invalid');
            return;
        }

        $.ajax({
            url: API_URL.team.addUser,
            method: 'POST',
            beforeSend: function (req) {
                req.setRequestHeader("X-CSRFToken", csrftoken);
            },
            dataType: 'json',
            data: data,
        }).fail(() => {
            toastr.error('failed to add user');
        }).done((res) => {
            if (res.return_code != 0) {
                toastr.error(`[${res.return_code}] ${res.msg}`);
                return;
            }
            toastr.success('user added');
            resetForm();

            inputDom.passwd.removeClass('is-invalid');
            inputDom.confirmpasswd.removeClass('is-invalid');
            TeamTableobj.selectedItem = null;
            TeamTableobj.refreshData();
        });
    });
}