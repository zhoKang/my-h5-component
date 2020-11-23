// 强制返回和 model 里面 state 的 key 相同的 prop state
//keyValueArray 一个 含有你需要的 prop key 的数组 ['hehe', 'haha']
export const mapStateToProps = (modelNameSpace, keyValueArray) => {
  if (!modelNameSpace || typeof modelNameSpace !== 'string')
    throw new Error('必须给一个 model 的 nameSpace 而且必须是 string 类型');

  return state => {
    const result = {};
    // 如果没有 全部返回
    if (!keyValueArray) keyValueArray = Object.keys(state[modelNameSpace]);
    // // console.log(state[modelNameSpace])
    keyValueArray.map(_ => {
      const value = state[modelNameSpace][_];
      result[_] = value;
      result[modelNameSpace] = state[modelNameSpace];
      result.loading = state.loading;
    });
    return result;
  };
};

// 参数规格同上
export const dispatchToProps = (modelNameSpace, keyValueArray = []) => {
  if (!modelNameSpace || typeof modelNameSpace !== 'string')
    throw new Error('必须给一个 model 的 nameSpace 而且必须是 string 类型');
  if (!keyValueArray) throw new Error('dispatch 必须要指定 keyValueArray 数组');
  return dispatch => {
    const result = {};
    keyValueArray.map(_ => {
      result[_] = payload => {
        return dispatch({ type: `${modelNameSpace}/${_}`, payload });
      };
    });
    return result;
  };
};
