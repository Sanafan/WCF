/**
 * Provides helper functions for file handling.
 * 
 * @author	Matthias Schmidt
 * @copyright	2001-2019 WoltLab GmbH
 * @license	GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @module	WoltLabSuite/Core/FileUtil
 */
define(['Dictionary', 'StringUtil'], function(Dictionary, StringUtil) {
	"use strict";
	
	var _fileExtensionIconMapping = Dictionary.fromObject({
		// archive
		zip: 'archive',
		rar: 'archive',
		tar: 'archive',
		gz: 'archive',
		
		// audio
		mp3: 'audio',
		ogg: 'audio',
		wav: 'audio',
		
		// code
		php: 'code',
		html: 'code',
		htm: 'code',
		tpl: 'code',
		js: 'code',
		
		// excel
		xls: 'excel',
		ods: 'excel',
		xlsx: 'excel',
		
		// image
		gif: 'image',
		jpg: 'image',
		jpeg: 'image',
		png: 'image',
		bmp: 'image',
		webp: 'image',
		
		// video
		avi: 'video',
		wmv: 'video',
		mov: 'video',
		mp4: 'video',
		mpg: 'video',
		mpeg: 'video',
		flv: 'video',
		
		// pdf
		pdf: 'pdf',
		
		// powerpoint
		ppt: 'powerpoint',
		pptx: 'powerpoint',
		
		// text
		txt: 'text',
		
		// word
		doc: 'word',
		docx: 'word',
		odt: 'word'
	});
	
	var _mimeTypeExtensionMapping = Dictionary.fromObject({
		// archive
		'application/zip': 'zip',
		'application/x-zip-compressed': 'zip',
		'application/rar': 'rar',
		'application/vnd.rar': 'rar',
		'application/x-rar-compressed': 'rar',
		'application/x-tar': 'tar',
		'application/x-gzip': 'gz',
		'application/gzip': 'gz',

		// audio
		'audio/mpeg': 'mp3',
		'audio/mp3': 'mp3',
		'audio/ogg': 'ogg',
		'audio/x-wav': 'wav',

		// code
		'application/x-php': 'php',
		'text/html': 'html',
		'application/javascript': 'js',

		// excel
		'application/vnd.ms-excel': 'xls',
		'application/vnd.oasis.opendocument.spreadsheet': 'ods',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',

		// image
		'image/gif': 'gif',
		'image/jpeg': 'jpg',
		'image/png': 'png',
		'image/x-ms-bmp': 'bmp',
		'image/bmp': 'bmp',
		'image/webp': 'webp',

		// video
		'video/x-msvideo': 'avi',
		'video/x-ms-wmv': 'wmv',
		'video/quicktime': 'mov',
		'video/mp4': 'mp4',
		'video/mpeg': 'mpg',
		'video/x-flv': 'flv',

		// pdf
		'application/pdf': 'pdf',

		// powerpoint
		'application/vnd.ms-powerpoint': 'ppt',
		'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',

		// text
		'text/plain': 'txt',

		// word
		'application/msword': 'doc',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
		'application/vnd.oasis.opendocument.text': 'odt'
	});
	
	return {
		/**
		 * Formats the given filesize.
		 * 
		 * @param	{integer}	byte		number of bytes
		 * @param	{integer}	precision	number of decimals
		 * @return	{string}	formatted filesize
		 */
		formatFilesize: function(byte, precision) {
			if (precision === undefined) {
				precision = 2;
			}
			
			var symbol = 'Byte';
			if (byte >= 1000) {
				byte /= 1000;
				symbol = 'kB';
			}
			if (byte >= 1000) {
				byte /= 1000;
				symbol = 'MB';
			}
			if (byte >= 1000) {
				byte /= 1000;
				symbol = 'GB';
			}
			if (byte >= 1000) {
				byte /= 1000;
				symbol = 'TB';
			}
			
			return StringUtil.formatNumeric(byte, -precision) + ' ' + symbol;
		},
		
		/**
		 * Returns the icon name for given filename.
		 * 
		 * Note: For any file icon name like `fa-file-word`, only `word`
		 * will be returned by this method.
		 *
		 * @parsm	{string}	filename	name of file for which icon name will be returned
		 * @return	{string}	FontAwesome icon name
		 */
		getIconNameByFilename: function(filename) {
			var lastDotPosition = filename.lastIndexOf('.');
			if (lastDotPosition !== false) {
				var extension = filename.substr(lastDotPosition + 1);
				
				if (_fileExtensionIconMapping.has(extension)) {
					return _fileExtensionIconMapping.get(extension);
				}
			}
			
			return '';
		},
		
		/**
		 * Returns a known file extension including a leading dot or an empty string.
		 *
		 * @param       mimetype        the mimetype to get the common file extension for
		 * @returns     {string}        the file dot prefixed extension or an empty string
		 */
		getExtensionByMimeType: function (mimetype) {
			if (_mimeTypeExtensionMapping.has(mimetype)) {
				return '.' + _mimeTypeExtensionMapping.get(mimetype);
			}
			
			return '';
		},
		
		/**
		 * Constructs a File object from a Blob
		 *
		 * @param       blob            the blob to convert
		 * @param       filename        the filename
		 * @returns     {File}          the File object
		 */
		blobToFile: function (blob, filename) {
			var ext = this.getExtensionByMimeType(blob.type);
			var File = window.File;
			
			try {
				// IE11 does not support the file constructor
				new File([], 'ie11-check');
			}
			catch (error) {
				// Create a good enough File object based on the Blob prototype
				File = function File(chunks, filename, options) {
					var self = Blob.call(this, chunks, options);
					
					self.name = filename;
					self.lastModifiedDate = new Date();
					
					return self;
				};
				
				File.prototype = Object.create(window.File.prototype);
			}
			
			return new File([blob], filename + ext, {type: blob.type});
		},
	};
});
