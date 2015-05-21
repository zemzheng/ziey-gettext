# Getext in javascript

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
     * @param {object|undefined}    # 设置成功返回 Object
     */
    gettext.handlePo( lang, po_file_path )

### gettext.handlePoTxt

    TODO to be continue ...

### gettext.gettext

    /**
     * @param {string} str
     * @return {string}    
     */
    gettext.gettext( str )
    gettext._( str ) // alias 

### gettext.clear

    TODO to be continue ...

### gettext.po2obj

    TODO to be continue ...

### gettext.obj2po

    TODO to be continue ...

## Test

    TODO to be continue ...
