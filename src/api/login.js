import request from '../utils/adminRequest';

export default {
    loginCheck: function (parm) {
        return request({
            url: 'admin/login/check',
            method: 'post',
            data: parm
        })
    }
};
