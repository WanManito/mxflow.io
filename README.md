#### 基于mxgraph.js开发的流程图组件

1.fabric.js
在决定使用mxgraph.js开发流程图之前，尝试过用fabric.js来开发，结果发现并没有想象中的那么简单，而且用户体验非常差，下面是体验地址：
https://wanmanito.github.io/mxflow.io/#/workflow，直到遇到一个致命bug，当我准备加一个双击图形输入文字功能，花了
一点时间捣鼓了一下，通过group组合实现了此功能，但是，第一次双击输入正常，第二次再次双击就出现莫名其妙的情况，最后反馈给作者说下个版本
不准备解决，看了下issues，也发现了类似的问题，此方案就此放弃。

2.GoJs
第二次有人推荐我使用GoJs，看了下功能确实强大，也找到了符合我想要的流程图应用，但是。。。。尝试运行简单的例子同步到Vue,没出什么问题，当同步
一个简单的流程图示例，各种问题，捣鼓了很久还是没能运行成功，最重要的它的api写法简直太难受，此方案也就此放弃。官方示例：
https://gojs.net/latest/samples/draggableLink.html

3.mxgraph.js

先上图来一波

体验地址：
https://wanmanito.github.io/mxflow.io/#/mxflow
说一下基础api的使用以及一些坑

1.定义全局Cell样式

    this.style = new Object();
    this.style[mxConstants.STYLE_DASHED] = 0;//0实线 1虚线
    this.style[mxConstants.STYLE_STROKEWIDTH] = 1;//边框宽度
    // this.style[mxConstants.STYLE_GRADIENTCOLOR] = 'red';//渐变色
    this.style[mxConstants.STYLE_GRADIENT_DIRECTION] = mxConstants.DIRECTION_WEST;//渐变方向  east-东 west-西 north-北 south-南
    this.style[mxConstants.STYLE_FONTFAMILY] = "consolas";//字体
    this.style[mxConstants.STYLE_FONTSTYLE] = 0;//1-加粗 2-斜体 4-下划线
    this.style[mxConstants.STYLE_HORIZONTAL] = 1;//1-水平 0-垂直
    this.style[mxConstants.STYLE_LABEL_POSITION] = "center";//文字居中 结合下面属性控制
    this.style[mxConstants.STYLE_VERTICAL_LABEL_POSITION] = "middle";//
    this.graph.getStylesheet().putDefaultVertexStyle(this.style);//put到全局style中
  
2.定义全局Edge、label样式

    this.style = this.graph.getStylesheet().getDefaultEdgeStyle();     
    this.style['fontSize'] = this.fontSize;
    this.style['verticalAlign'] = 'bottom';
    this.style[mxConstants.STYLE_ROUNDED] = true;
    this.style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
    this.style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = "white";//transparent 连线文字背景颜色
    this.style[mxConstants.STYLE_ORTHOGONAL_LOOP] = 1;
    this.style[mxConstants.STYLE_JETTY_SIZE] = "auto";  
  
3.局部样式

    let style = new Object();
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_IMAGE;
    style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
    style[mxConstants.STYLE_IMAGE] = '../../../static/img/star_200.png';
    style[mxConstants.STYLE_FONTCOLOR] = 'black';
    this.graph.getStylesheet().putCellStyle('image', style);//自定义背景style
    this.graph.insertVertex(this.parent, null, 'star', x, y, 100, 100, 'image');//使用方式

4.修改全局Cell默认样式 Edge同理

    let style = this.graph.getStylesheet().getDefaultVertexStyle();
    style[mxConstants.STYLE_FONTCOLOR] = this.color;
    
5.设置单个或者多个Cell样式 Edge同理

     this.graph.setCellStyles(mxConstants.STYLE_GRADIENT_DIRECTION, this.curDirGradient);//第一种方式
     this.graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, "none", [vertex]);//第二种方式
      
6.复制

    let selectionCells = this.graph.getSelectionCells();
    mxClipboard.copy(this.graph, selectionCells);
    
7.粘贴

    mxClipboard.paste(this.graph);
    
8.剪切

    let selectionCells = this.graph.getSelectionCells();
    mxClipboard.cut(this.graph, selectionCells);

9.放大

    this.graph.zoomIn();
    
10.缩小

    this.graph.zoomOut();

11.撤销与还原

    初始化：
    this.undoMng = new mxUndoManager();
    let listener = (sender, evt) => {
        this.undoMng.undoableEditHappened(evt.getProperty('edit'));
                  };
     this.graph.getModel().addListener(mxEvent.UNDO, listener);
     his.graph.getView().addListener(mxEvent.UNDO, listener);
     撤销：
     this.undoMng.undo();
     还原：
     this.undoMng.redo();
    
12.组合

    let vertex = new mxCell(null, new mxGeometry(0, 0));
    vertex.setVertex(true);
    this.graph.groupCells(vertex, 0, this.graph.getSelectionCells());
    
13.分解

    this.graph.ungroupCells(this.graph.getSelectionCells());
    
14.加载xml自定义图形

    try {
         let req = mxUtils.load(this.staticPath+'xml/basic.xml');//此处路径写成项目资源文件目录
         let root = req.getDocumentElement();
         let shape = root.firstChild;
         while (shape != null) {
         if (shape.nodeType == mxConstants.NODETYPE_ELEMENT) {
            let name = shape.getAttribute('name');
            this.basicItems.push(name);//存储读取的shape名称数组
            mxStencilRegistry.addStencil(name, new mxStencil(shape));
            }
             shape = shape.nextSibling;
                    }
          } catch (e) {
              mxUtils.alert('Cannot load' + e);
            }
    使用方式：
    let basic = document.getElementById("basic");
    this.basicItems.forEach((name, index) => {
                        basic.append(this.createItem("", 45, 45, "shape=" + name));
                    });
    createItem方法：
    createItem(title, width, height, style) {
       let vertex = new mxCell(null, new mxGeometry(0, 0, width, height), style);
       vertex.setVertex(true);
       let elt = document.createElement('div');
       elt.className = 'el-col el-col-8  basic';
       // elt.style.overflow = 'hidden';
       // Blocks default click action
       // mxEvent.addListener(elt, 'click', function(evt)
       // {
       //     mxEvent.consume(evt);
       // });
       // this.graph.view.scaleAndTranslate(1, 0, 0);
       this.graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, "none", [vertex]);
       this.graph.setCellStyles(mxConstants.STYLE_STROKEWIDTH, 3, [vertex]);
       this.graph.setCellStyles(mxConstants.STYLE_STROKECOLOR, "#515151", [vertex]);
       this.graph.setCellStyles(mxConstants.STYLE_SHADOW, false, [vertex]);
       this.graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER, [vertex]);
       this.graph.setCellStyles(mxConstants.STYLE_IMAGE_WIDTH, 48, [vertex]);
       this.graph.setCellStyles(mxConstants.STYLE_IMAGE_HEIGHT, 48, [vertex]);
       this.graph.addCell(vertex);
       let node;
       node = this.graph.view.getCanvas().ownerSVGElement.cloneNode(true);
       this.graph.getModel().clear();
       elt.appendChild(node);
       return elt;
        },//创建自定义html包裹的svg
        
 15.一些坑
 
    有些全局样式也可以直接修改，（不用像上面那样put）例如：
    mxConstants.VERTEX_SELECTION_COLOR = "#29B6F2";
    
    鼠标框选 不显示背景颜色
    new mxRubberband(this.graph);
    解决办法添加以下css
    div.mxRubberband {
          position: absolute;
          overflow: hidden;
          border-style: solid;
          border-width: 1px;
          border-color: #0000FF;
          background: #3481D7;
        }
        
    加载xml自定义图形上面14点已完整说明。

暂时就介绍那么多，还有很多细节设置就下次再说了。
