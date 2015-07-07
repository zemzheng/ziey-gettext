# Getext in javascript

[![Build Status](https://travis-ci.org/zemzheng/ziey-gettext.svg?branch=master)](https://travis-ci.org/zemzheng/ziey-gettext)

i18n tool, gnu gettext

1. po format string to/from javascript object
2. load po format file
3. save to po format file

## Install

    npm install ziey-gettext

## Usage

    var gettext = require( 'ziey-i18n' );

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
