


let SELECTING = false;
let svg = null;


// assemble container element
const container = document.createElement('div');

container.id = 'visual-history-container';

// attach container element to document body wherever convenient
if (document.body.firstChild)
    document.body.insertBefore(container, document.body.firstChild);
else
    document.body.appendChild(container);

container.onclick = e => exit(false);

function exit(url) {



    let elements = document.getElementsByTagName('svg');

    for (let elem of elements) {

        elem.remove();

    }


    container.className = '';
    svg = null;
    document.body.classList.remove('visual-history-freeze');

    container.style.opacity = '0';

    SELECTING = !SELECTING;

}
function click(node) {
    // this is the only time we callback with a url
    // in all other cases, backend.js already knows
    // about the changes and will update accordingly
    exit(node.data.url);
}

chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {

    console.log(data);


    if(data['action'] == 'image') {

        image.setAttribute("src", data['img']);

        console.log(image);

        document.body.appendChild(image);
    }
    else {


        if(false){

            svg = d3_selection.select('#visual-history-container')
                .append('svg')
                .attr('width', 100)
                .attr('height', 100)
                .attr('id', 'visual-history-svg')
                .append('g');

            // append and class links
            // const links = svg.selectAll('path').data(data.links, link => link.id);
            // links.enter().append('line')
            //     .attr("class", "visual-history-link")
            //     .attr("x1", link => link.source.x)
            //     .attr("y1", link => link.source.y)
            //     .attr("x2", link => link.target.x)
            //     .attr("y2", link => link.target.y);

            const nodes = svg.selectAll('g').data(data.root, node => node.id);
            const createNode = nodes.enter().append('g')
                .attr('transform', node => `translate(${node.position.x},${node.position.y})`)
                .classed('visual-history-current', node => node.id === data.current.id)
                .classed('visual-history-preview', node => node.data.preview)
                .classed('visual-history-node', true)
                .attr('id', node => `visual-history-id-${node.id}`)
                .on('click', click);
        }
        else {

            document.body.classList.add('visual-history-freeze');
            container.className = 'visual-history-container-visible';

            container.style.setProperty("top", String(document.body.scrollTop) + 'px', "important");
            container.style.setProperty("left", String(document.body.scrollLeft) + 'px', "important");
            container.style.opacity = '1';

            if(SELECTING) {

                exit(false);

            }
            else {
                const histreeVisualization = new HistreeVisualization(data.depth, data.width);
                histreeVisualization.drawTree(data.root, data.currentNode);


                SELECTING = !SELECTING;

            }
        }
    }
});
window.addEventListener("beforeunload", function (event) {
    // Cancel the event as stated by the standard.

    chrome.runtime.sendMessage({'test':'tt'}, (response )=> {});


});
