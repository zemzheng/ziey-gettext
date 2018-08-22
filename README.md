# Getext in javascript

[![Build Status](https://travis-ci.org/zemzheng/ziey-gettext.svg?branch=master)](https://travis-ci.org/zemzheng/ziey-gettext)

i18n tool, gnu gettext

1. po format string to/from javascript object
2. load po format file
3. save to po format file

* node version: 8+

## Install

    npm install ziey-gettext

## Usage

    var gettext = require( 'ziey-gettext' );

### gettext.getLang

    /**
     * @return {string}   # 当前语言
     */
    gettext.getLang()

### gettext.setLang

    /**
     * @param {string} lang         # 设置当前语言，Exp: zh_CN, en_US ...
     * @return {string}             # 当前语言
     */
    gettext.setLang( lang )

### gettext.handlePo

    /**
     * @param {string} lang         # 设置的语言名称，Exp: zh_CN, en_US ...
     * @param {string} po_file_path # po 文件路径
     * @return {object|undefined}   # 设置成功返回 Object
     */
    gettext.handlePo( lang, po_file_path )

### gettext.handlePoTxt

    /**
     * @param {string} lang       # 设置的语言名称，Exp: zh_CN, en_US ...
     * @param {string} po_text    # po 格式内容
     * @return {object|undefined} # 设置成功返回 Object
     */
    gettext.handlePo( lang, po_text )

### gettext.gettext

    /**
     * @param {string} str # 要翻译的文本
     * @return {string}    # 返回翻译结果
     */
    gettext.gettext( str )
    gettext._( str ) // alias 

### gettext.clear

    /**
     * @description 清空翻译词条
     */
    gettext.clear()

### gettext.updateCurrentDict

    /**
     * @param {string} msgid             # 词条原文，新增或者更新现有词典
     * @param {object} opts              # 更新明细
     * @param {string} opts.str          # 词条译文
     * @param {reference} opts.reference # 词条来源
     */
    gettext.updateCurrentDict( msgid, opts )

### gettext.cleanCurrentDictReference

    /**
     * @description 清空当前词典中的来源
     */
    gettext.cleanCurrentDictReference()

### gettext.clearCurrentDictEmptyItem [Discard]

    /**
     * @description 清空当前词典中的空词条 （废弃）
     *              建议使用 clearDict
     */
    gettext.clearCurrentDictEmptyItem()

### gettext.clearDict

    /**
     * @description 清理字典
     * @param {boolean} options.str 是否要根据 str 为空来清理
     * @param {boolean} options.reference 是否要根据 reference 为空来清理
     * @param {string} options.lang? 指定语言，默认为当前选中语言
     */
    gettext.clearDict()

### gettext.po2obj

    /**
     * @param {string} po_text # po 格式内容
     * @return {object}        # 根据 po 文本生成的 object 对象
     */
    gettext.po2obj( po_text );

### gettext.obj2po

    /**
     * @param {object} obj    # 带翻译标识的 object 对象
     * @param {string} header # 需要补充到  header 的文本
     * @return {string}       # 生成的 po 格式文本
     */
    gettext.obj2po( obj, header );

## Test

    npm test
