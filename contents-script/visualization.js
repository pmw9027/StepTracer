// Scripts order
// pop_up_utils
// d3.min (d3 visualization library)
// * visualization
// browser_action.js

class HistreeVisualization {
    constructor(depth, leaves) {
        this.margin = {
            top: 20,
            right: 80,
            bottom: 20,
            left: 80
        };
        // Height and width of popup window
        this.width = depth * 140 - this.margin.right - this.margin.left;
        this.height = leaves * 120 - this.margin.top - this.margin.bottom;

        this.i = 0;
        this.duration = 750;
        this.root = null;

        this.tree = d3.layout.tree()
            .size([this.height, this.width]);

        this.diagonal = d3.svg.diagonal()
            .projection(d => [d.y, d.x]);

        this.svg = d3.select("#visual-history-container")
            .append("svg")
            .attr("width", this.width + this.margin.right + this.margin.left)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    }

    update(source, current_node) {

        let x = null;
        let y = null;

        document.addEventListener('mousemove', onMouseUpdate, false);
        document.addEventListener('mouseenter', onMouseUpdate, false);

        function onMouseUpdate(e) {
            x = e.pageX;
            y = e.pageY;
            //console.log(x, y);
        }

        function getMouseX() {
            return x;
        }

        function getMouseY() {
            return y;
        }

        //////////////////////////////////////////////////////////////
        $("#visual-history-container")
        // 1, 2, 3, 4 사분면
            .css("left", `${window.scrollX}px`)
            .css("top",`${window.scrollY}px`)
            .css("width", `${window.innerWidth - 10}px`)
            .css("height",`${window.innerHeight - 10}px`);

            // 1, 2 사분면
            // .css("left", `${window.scrollX}px`)
            // .css("top",`${window.scrollY}px`)
            // .css("width", `${window.innerWidth - 10}px`)
            // .css("height",`${(window.innerHeight - 10) / 2}px`);

            // 1, 3 사분면
            // .css("left", `${window.scrollX + window.innerWidth/2}px`)
            // .css("top",`${window.scrollY}px`)
            // .css("width", `${(window.innerWidth - 10) / 2}px`)
            // .css("height",`${window.innerHeight - 10}px`);

            // 1 사분면
            // .css("left", `${window.scrollX + window.innerWidth/2}px`)
            // .css("top",`${window.scrollY}px`)
            // .css("width", `${(window.innerWidth - 10) / 2}px`)
            // .css("height",`${(window.innerHeight - 10) / 2}px`);

        // Compute the new tree layout.
        var nodes = this.tree.nodes(this.root)
            .reverse();
        var links = this.tree.links(nodes);

        // Normalize for fixed-depth.
        nodes.forEach(function(d) {
            d.y = d.depth * 140;
        });

        // Update the nodes…
        var node = this.svg.selectAll("g.node")
        // Make sure all nodes have id's
            .data(nodes, d => d.id || (d.id = ++this.i))

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            })
            .on("click", data => this.clickNode(data));

        nodeEnter.append("text")
            .attr("dx", "-1")
            .attr("dy", "+30")
            .attr("text-anchor", 'middle')
            .text((d) => firstNCharacters(d.title))
            .style("fill", "white")
            .style("fill-opacity", 1e-6)
            .call(function(selection) {
                selection.each(function(d) {
                    d.bbox = this.getBBox();
                });
            });

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(this.duration)
            .attr("transform", function(d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

        // append images to the node g cells
        let img_blue = chrome.extension.getURL('icons/icon_blue_48.png');
        let img_yellow = chrome.extension.getURL('icons/icon_yellow_48.png');
        nodeEnter.append('image')
            .attr('x', `-${32 / 2.0}px`)
            .attr('y', `-${32 / 2.0}px`)
            .attr('width', `${32}px`)
            .attr('height', `${32}px`)
            .attr('xlink:href', d => (d.url === current_node.url) ? img_yellow : img_blue)
            .attr('class', 'node')
            .on('mouseover', function(e){

                let xOffset = 0;
                let yOffset = 0;
                let title = firstNCharacters(e.title, 20);
                var c = (title != "") ? "<br/><br/>" + title : "";
                $("#visual-history-container")
                    .append(`<p id='preview'>
                            <img src='${e.image}'
                                 href="${e.url}" 
                                 style='width:238px; height:135px; border: solid 1px; border-radius: 2px;' 
                                 alt='Image preview'
                            /> 
                            ${c}
                            </p>`);

                //////////////////////////////////////////////////////////////
                $("#preview")
                // 1, 2, 3, 4 사분면
                    .css("top", `${y-window.scrollY}px`)
                    .css("left",`${x-window.scrollX}px`)

                    // 1, 2 사분면
                    // .css("top", `${y-window.scrollY }px`)
                    // .css("left",`${x-window.scrollX}px`)

                    // 1, 3 사분면
                    // .css("top", `${y-window.scrollY}px`)
                    // .css("left",`${x-window.scrollX - (window.innerWidth/2) }px`)

                    // 1 사분면
                    // .css("top", `${y-window.scrollY}px`)
                    // .css("left",`${x-window.scrollX - (window.innerWidth/2)}px`)
                    .fadeIn("slow");

                console.log('mouseover 이벤트 발생', e);
            })
            .on('mouseout', function(e){
                $("#preview").remove();
                console.log('mouseout 이벤트 발생', e);
            });


        nodeUpdate.select("text")
            .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit()
            .transition()
            .duration(this.duration)
            .attr("transform", function(d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();

        nodeExit.select("circle")
            .attr("r", 1e-6);

        nodeExit.select("text")
            .style("fill-opacity", 1e-6);


        // Update the links…
        var link = this.svg.selectAll("path.link")
            .data(links, function(d) {
                return d.target.id;
            });

        // Enter any new links at the parent's previous position.
        link.enter()
            .insert("path", "g")
            .attr("class", "link")
            .attr("stroke-dasharray", "10, 5")
            .attr("d", (d) => {
                var o = {
                    x: source.x0,
                    y: source.y0
                };
                return this.diagonal({
                    source: o,
                    target: o
                });
            });

        // Transition links to their new position.
        link.transition()
            .duration(this.duration)
            .attr("d", this.diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit()
            .transition()
            .duration(this.duration)
            .attr("d", (d) => {
                var o = {
                    x: source.x,
                    y: source.y
                };
                return this.diagonal({
                    source: o,
                    target: o
                });
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    drawTree(tree, current_node) {
        // Once we've recieved the tree from the background
        // we set the root node's position
        this.root = tree;
        this.root.x0 = this.height / 2;
        this.root.y0 = 0;

        // Then we call the 'update' method to trigger the rest of the visualization
        this.update(this.root, current_node);
    }

    // Navigate to child on node click
    clickNode(d) {
        tellTabToNavigateTo(d.url);
        exit(d.url);
    }
}
