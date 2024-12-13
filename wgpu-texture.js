export function GenerateVertexDataAndTexture(state, glyphCanvas, generateGlyphVerticesForText, COLORS, config, createTextureFromSource) {
    const glyphData = generateGlyphVerticesForText('Hello\nworld!\nText in\nWebGPU!', COLORS, config, glyphCanvas);
    state.webgpu.device.queue.writeBuffer(state.webgpu.vertexBuffer, 0, glyphData.vertexData);

    state.webgpu.texture = createTextureFromSource(state.webgpu.device, glyphCanvas, { mips: true });
    state.webgpu.sampler = state.webgpu.device.createSampler({
        minFilter: 'linear',
        magFilter: 'linear',
    });

    state.webgpu.uniformBuffer = state.webgpu.device.createBuffer({
        label: 'uniforms for quad',
        size: config.uniformBufferSize,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    state.matrices.matrix = state.matrices.uniformValues.subarray(0, 16);

    state.webgpu.bindGroup = state.webgpu.device.createBindGroup({
        layout: state.webgpu.pipeline.getBindGroupLayout(0),
        entries: [
            { binding: 0, resource: state.webgpu.sampler },
            { binding: 1, resource: state.webgpu.texture.createView() },
            { binding: 2, resource: { buffer: state.webgpu.uniformBuffer } },
        ],
    });

    state.glyphs.numGlyphs = glyphData.numGlyphs;
    state.glyphs.width = glyphData.width;
    state.glyphs.height = glyphData.height;
}
