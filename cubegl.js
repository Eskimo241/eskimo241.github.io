var canvas = document.getElementById('webgl-cube');
        var gl = canvas.getContext('webgl');

        var vertices = [
            -1, -1,  1,  // front bottom left
             1, -1,  1,  // front bottom right
             1,  1,  1,  // front top right
            -1,  1,  1,  // front top left
            -1, -1, -1,  // back bottom left
             1, -1, -1,  // back bottom right
             1,  1, -1,  // back top right
            -1,  1, -1   // back top left
        ];

        var colors = [
            1, 0, 0,  // red
            0, 1, 0,  // green
            0, 0, 1,  // blue
            1, 1, 0,  // yellow
            1, 0, 1,  // magenta
            0, 1, 1,  // cyan
            1, 1, 1,  // white
            0.5, 0.5, 0.5   // black
        ];


        var indices = [
    0, 1, 1, 2, 2, 3, 3, 0,    // front
    4, 5, 5, 6, 6, 7, 7, 4,    // back
    0, 4, 1, 5, 2, 6, 3, 7     // sides
];

        var vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, `
            attribute vec3 position;
            attribute vec3 color;
            varying vec3 vColor;
            uniform mat4 modelViewMatrix;
            uniform mat4 projectionMatrix;
            void main(void) {
                vColor = color;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `);
        gl.compileShader(vertexShader);

        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, `
            precision mediump float;
            varying vec3 vColor;
            void main(void) {
                gl_FragColor = vec4(vColor, 1.0);
            }
        `);
        gl.compileShader(fragmentShader);

        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        gl.useProgram(shaderProgram);

        var vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        var colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        var indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        var modelViewMatrix = mat4.create();
        var projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix, 45 * Math.PI / 180, canvas.width / canvas.height, 0.1, 100.0);
        mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -6.0]);

        var angle = 0;

        function animate() {
            angle = 0.01;
            mat4.rotateY(modelViewMatrix, modelViewMatrix, angle*2);
            mat4.rotateX(modelViewMatrix, modelViewMatrix, angle);
            mat4.perspective(projectionMatrix, 45 * Math.PI / 180, canvas.width / canvas.height, 0.1, 100.0);

            drawCube();
            requestAnimationFrame(animate);
        }

        animate();

        function drawCube() {
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.enable(gl.DEPTH_TEST);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            var position = gl.getAttribLocation(shaderProgram, 'position');
            gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(position);

            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            var color = gl.getAttribLocation(shaderProgram, 'color');
            gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(color);

            var uModelViewMatrix = gl.getUniformLocation(shaderProgram, 'modelViewMatrix');
            gl.uniformMatrix4fv(uModelViewMatrix, false, modelViewMatrix);
            var uProjectionMatrix = gl.getUniformLocation(shaderProgram, 'projectionMatrix');
            gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix);

            gl.lineWidth(2);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            gl.drawElements(gl.LINES, indices.length, gl.UNSIGNED_SHORT, 0);
        }



// Set the canvas size to the window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
}

// Resize the canvas to the window size when the window is resized
window.addEventListener('resize', resizeCanvas);

// Initial resize
resizeCanvas();