
using GeometricIntegrators.Equations
using GeometricIntegrators.Utils


function α1(t, q)
    A1(t,q) + q[4] * b1(t,q)
end

function α2(t, q)
    A2(t,q) + q[4] * b2(t,q)
end

function α3(t, q)
    R(t,q) * ( A3(t,q) + q[4] * b3(t,q) )
end

function α4(t, q)
    zero(eltype(q))
end


function α(t, q, p)
    p[1] = α1(t,q)
    p[2] = α2(t,q)
    p[3] = α3(t,q)
    p[4] = α4(t,q)
    nothing
end


function β(t, q, Β)
    Β[1,1] = 0
    Β[1,2] =-β3(t,q)
    Β[1,3] = β2(t,q)
    Β[1,4] = b1(t,q)

    Β[2,1] = β3(t,q)
    Β[2,2] = 0
    Β[2,3] =-β1(t,q)
    Β[2,4] = b2(t,q)

    Β[3,1] =-β2(t,q)
    Β[3,2] = β1(t,q)
    Β[3,3] = 0
    Β[3,4] = b3(t,q)

    Β[4,1] =-b1(t,q)
    Β[4,2] =-b2(t,q)
    Β[4,3] =-b3(t,q)
    Β[4,4] = 0

    nothing
end


function dα1d1(t, q)
    dA1d1(t,q) + q[4] * db1d1(t,q)
end

function dα1d2(t, q)
    dA1d2(t,q) + q[4] * db1d2(t,q)
end

function dα1d3(t, q)
    dA1d3(t,q) + q[4] * db1d3(t,q)
end

function dα2d1(t, q)
    dA2d1(t,q) + q[4] * db2d1(t,q)
end

function dα2d2(t, q)
    dA2d2(t,q) + q[4] * db2d2(t,q)
end

function dα2d3(t, q)
    dA2d3(t,q) + q[4] * db2d3(t,q)
end

function dα3d1(t, q)
    R(t,q) * ( dA3d1(t,q) + q[4] * db3d1(t,q) ) + dRd1(t,q) * ( A3(t,q) + q[4] * b3(t,q) )
end

function dα3d2(t, q)
    R(t,q) * ( dA3d2(t,q) + q[4] * db3d2(t,q) ) + dRd2(t,q) * ( A3(t,q) + q[4] * b3(t,q) )
end

function dα3d3(t, q)
    R(t,q) * ( dA3d3(t,q) + q[4] * db3d3(t,q) ) + dRd3(t,q) * ( A3(t,q) + q[4] * b3(t,q) )
end



function β1(t,q)
   return dα3d2(t,q) - dα2d3(t,q)
end

function β2(t,q)
   return dα1d3(t,q) - dα3d1(t,q)
end

function β3(t,q)
   return dα2d1(t,q) - dα1d2(t,q)
end


function β(t,q)
   return sqrt(β1(t,q)^2 + β2(t,q)^2 + β3(t,q)^2)
end


function hamiltonian(t,q)
    0.5 * q[4]^2 + μ*B(t,q)
end

function toroidal_momentum(t,q)
    α3(t,q)
end


function guiding_center_4d_periodicity(q₀)
    periodicity = zeros(eltype(q₀), size(q₀,1))
    periodicity[3] = 2π
    return periodicity
end


function f1(t, q, v)
    dα1d1(t,q) * v[1] + dα2d1(t,q) * v[2] + dα3d1(t,q) * v[3]
end

function f2(t, q, v)
    dα1d2(t,q) * v[1] + dα2d2(t,q) * v[2] + dα3d2(t,q) * v[3]
end

function f3(t, q, v)
    dα1d3(t,q) * v[1] + dα2d3(t,q) * v[2] + dα3d3(t,q) * v[3]
end

function f4(t, q, v)
    b1(t,q) * v[1] + b2(t,q) * v[2] + R(t,q) * b3(t,q) * v[3]
end


function dHd1(t, q)
    μ * dBd1(t,q)
end

function dHd2(t, q)
    μ * dBd2(t,q)
end

function dHd3(t, q)
    μ * dBd3(t,q)
end

function dHd4(t, q)
    q[4]
end


function guiding_center_4d_ode_v(t, q, v)
    local β₀ = β(t,q)
    local β₁ = β1(t,q)
    local β₂ = β2(t,q)
    local β₃ = β3(t,q)

    local B₁ = B1(t,q)
    local B₂ = B2(t,q)
    local B₃ = B3(t,q)

    local BB = B₁ * β₁ + B₂ * β₂ + B₃ * β₃

    local ∇₁B = dBd1(t,q)
    local ∇₂B = dBd2(t,q)
    local ∇₃B = dBd3(t,q)

    v[1] = q[4] * β₁ / β₀ + μ * ( ∇₂B * B₃ - ∇₃B * B₂ ) / BB
    v[2] = q[4] * β₂ / β₀ + μ * ( ∇₃B * B₁ - ∇₁B * B₃ ) / BB
    v[3] = q[4] * β₃ / β₀ + μ * ( ∇₁B * B₂ - ∇₂B * B₁ ) / BB
    v[4] = - ( μ * ∇₁B * β₁ / β₀
             + μ * ∇₂B * β₂ / β₀
             + μ * ∇₃B * β₃ / β₀ )

    nothing
end

function guiding_center_4d_ode(q₀=q₀; periodic=true)
    if periodic
        ODE(guiding_center_4d_ode_v, q₀; periodicity=guiding_center_4d_periodicity(q₀))
    else
        ODE(guiding_center_4d_ode_v, q₀)
    end
end


function guiding_center_4d_iode_α(t, q, v, p)
    α(t, q, p)
end

function guiding_center_4d_iode_f(t, q, v, f)
    f[1] = f1(t,q,v) - dHd1(t,q)
    f[2] = f2(t,q,v) - dHd2(t,q)
    f[3] = f3(t,q,v) - dHd3(t,q)
    f[4] = f4(t,q,v) - dHd4(t,q)
    nothing
end

function guiding_center_4d_iode_g(t, q, λ, g)
    g[1] = f1(t,q,λ)
    g[2] = f2(t,q,λ)
    g[3] = f3(t,q,λ)
    g[4] = f4(t,q,λ)
    nothing
end

function guiding_center_4d_iode_v(t, q, p, v)
    guiding_center_4d_ode_v(t, q, v)
end

function guiding_center_4d_iode(q₀=q₀; periodic=true)
    p₀ = zeros(q₀)

    if ndims(q₀) == 1
        α(0, q₀, p₀)
    else
        for i in 1:size(q₀,2)
            tq = zeros(eltype(q₀), size(q₀,1))
            tp = zeros(eltype(p₀), size(p₀,1))
            simd_copy_xy_first!(tq, q₀, i)
            α(0, tq, tp)
            simd_copy_yx_first!(tp, p₀, i)
        end
    end

    if periodic
        IODE(guiding_center_4d_iode_α, guiding_center_4d_iode_f,
             guiding_center_4d_iode_g, guiding_center_4d_iode_v,
             q₀, p₀; periodicity=guiding_center_4d_periodicity(q₀))
    else
        IODE(guiding_center_4d_iode_α, guiding_center_4d_iode_f,
             guiding_center_4d_iode_g, guiding_center_4d_iode_v,
             q₀, p₀)
    end
end