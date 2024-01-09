self.onmessage = function(e) {
    const { width, height, offsetX, offsetY, zoom } = e.data;

    function mandelbrot(c_re, c_im, max_iter) {
        let x = 0, y = 0, r2 = 0;
        let i;
        for (i = 0; i < max_iter && r2 < 4; i++) {
            let x_new = x*x - y*y + c_re;
            y = 2*x*y + c_im;
            x = x_new;
            r2 = x*x + y*y;
        }
        return i;
    }

    const imageData = new ImageData(width, height);
    const mandelbrotData = new Array(width * height);
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            mandelbrotData[y * width + x] = mandelbrot((x - offsetX) / zoom, (y - offsetY) / zoom, 1000);
        }
    }

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let m = mandelbrotData[y * width + x];
            let isEdge = x > 0 && y > 0 && x < width - 1 && y < height - 1 &&
                (mandelbrotData[(y - 1) * width + x] === 1000 ||
                mandelbrotData[(y + 1) * width + x] === 1000 ||
                mandelbrotData[y * width + (x - 1)] === 1000 ||
                mandelbrotData[y * width + (x + 1)] === 1000);
            const color = m === 1000 ? [0, 0, 0, 255] : (isEdge ? [255, 0, 0, 255] : [0, 0, 0, 255]);
            imageData.data.set(color, (y * width + x) * 4);
        }
    }

    self.postMessage(imageData);
};