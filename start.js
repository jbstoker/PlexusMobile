/*
* @Author: Jelmer
* @Date:   2016-06-07 10:17:26
* @Last Modified by:   Jelmer
* @Last Modified time: 2016-06-07 10:27:37
*/
const electron = require('electron-prebuilt'),
      proc = require('child_process'),
      child = proc.spawn(electron, ['.']);