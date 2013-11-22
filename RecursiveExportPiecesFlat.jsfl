var outputScaleFactor = 2;

fl.outputPanel.clear();

var inputFolderURI = fl.browseForFolderURL('Select input folder');
inputFolderURI = inputFolderURI.replace(/%20/g, " ");
var outputFolderURI = fl.browseForFolderURL('Select output folder');
outputFolderURI = outputFolderURI.replace(/%20/g, " ");

searchFla(inputFolderURI, exportFileAsPieces);

// searchFla function from: http://hawaiiantime.jp/blog/44/
function searchFla(dir, func)
{
	var fileList = FLfile.listFolder(dir);
	var len = fileList.length;
	var uri;
	var attr;
 
	for (var i = 0; i < len; i++)
	{
		// make a file path
		uri = decodeURI(dir + "/" + fileList[i]);
 
		// check it's not a .svn file
		if (FLfile.exists(uri) && uri.indexOf(".svn") == -1)
		{ 
			// get the file's info
			attr = FLfile.getAttributes(uri);
 
			// if it's a directory...
			if (attr && (attr.indexOf("D") != -1))
			{
				// recursion
				searchFla(uri, func);
			}
			// if it's a flash file
			else if (uri.indexOf(".fla") != -1)
			{
				// execute
				func(uri);
			}
		}
	}
}

function exportFileAsPng(input)
{
	var outputFile = input.replace(inputFolderURI, outputFolderURI);
	outputFile = outputFile.replace(".fla", ".png");

	verifyPathExists(outputFile);

	var document = fl.openDocument(input);

	try
	{
		document.width *= outputScaleFactor;
		document.height *= outputScaleFactor;
		document.selectAll();
		document.scaleSelection(outputScaleFactor, outputScaleFactor, "top left");
		document.exportPNG(outputFile, true, true);
	}
	catch(error)
	{
		fl.trace("Error: " + error.message + " File: " + input);
	}

	fl.closeDocument(document, false);
}

function exportFileAsPieces(input)
{
	var outputFile = input.replace(inputFolderURI, outputFolderURI);
	var outputFolder = outputFile.slice(0, -4);

	verifyPathExists(outputFile);

	var document = fl.openDocument(input);

	try
	{
		if(document.library.items && document.library.items.length > 0)
		{
			var newDocument = fl.createDocument();

			for(i in document.library.items)
			{
	    		var item = document.library.items[i];

	    		if(item.itemType == "movie clip" || item.itemType == "graphic" || item.itemType == "bitmap")
	    		{
	    			var itemName = item.name.split('.')[0];
	    			var exportPath = removeBrackets(outputFolder + "/" + itemName + ".png");

	    			verifyPathExists(exportPath);

	    			newDocument.width = document.width * outputScaleFactor;
	    			newDocument.height = document.height * outputScaleFactor;
				    newDocument.addItem({x:0.0, y:0.0}, item);
    				newDocument.library.selectItem(item.name, false);
    				newDocument.scaleSelection(outputScaleFactor, outputScaleFactor, "top left");

        			newDocument.exportPNG(exportPath, true, false);

	        		newDocument.selectAll();
					newDocument.deleteSelection();	
        		}		
			}

			fl.closeDocument(newDocument, false);
		}
	}
	catch(error)
	{
		fl.trace("Error: " + error.message + " File: " + input);
	}

	fl.closeDocument(document, false);
}

function convertFlashToPng(input)
{
	var outputFile = input.replace(inputFolderURI, outputFolderURI);
	var outputFolder = outputFile.slice(0, -4);

	//try
	//{
		fl.closeAll(false);

		var oldDoc = fl.openDocument(input);
		var oldDom = fl.getDocumentDOM();

		if(oldDom.library.items && oldDom.library.items.length > 0)
		{
			var newDoc = fl.createDocument();
			var newDom = fl.getDocumentDOM();

			for(i in oldDom.library.items)
			{
	    		var currentItem = oldDom.library.items[i];
        		exportItemAsPng(currentItem, outputScaleFactor, outputFolder, newDoc, newDom);
			}
			fl.closeDocument(newDoc, false);
		}

		verifyPathExists(outputFile);
		oldDoc.selectAll();
		oldDoc.scaleSelection(outputScaleFactor, outputScaleFactor);
		oldDom.exportPNG(outputFile, true, false);

		fl.closeDocument(oldDoc, false);
	//}
	//catch(error)
	//{
//		fl.trace("Error processing file: " + input);
//		fl.trace(error);
//	}
}

function exportItemAsPng(item, scaleFactor, outputFolder, document, dom)
{
    var itemName = item.name.split('.')[0];
    var exportPath = outputFolder + "/" + itemName + ".png";

    document.addItem({x:0.0, y:0.0}, item);
    dom.library.selectItem(item.name, false);
    document.scaleSelection(scaleFactor, scaleFactor);

    var tempPath = removeBrackets(exportPath);
    verifyPathExists(tempPath);

    if(item.itemType == "movie clip")
        document.exportInstanceToPNGSequence(tempPath);
    else
        document.exportPNG(tempPath, true, false);

    document.selectAll();
    document.deleteSelection();
}


function verifyPathExists(path)
{
    FLfile.createFolder(path.substring(0, path.lastIndexOf("/")));
}

function removeBrackets(path)
{
	var temp = path.replace(/</g, '');
	temp = temp.replace(/>/g, '');
	return temp;
}
