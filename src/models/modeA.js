const modeA = {
  namespace: 'modeA',
  state: {},
  effects: {
    // 请求验证码
    *ReqAuthCode({ payload }, { call, put, select }) {
      return {
        code: 200,
        msg: '获取成功',
      };
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
export default modeA;
