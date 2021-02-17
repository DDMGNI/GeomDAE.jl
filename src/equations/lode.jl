@doc raw"""
`LODE`: Variational Ordinary Differential Equation *EXPERIMENTAL*

Defines an implicit initial value problem
```math
\begin{aligned}
\dot{q} (t) &= v(t) , &
q(t_{0}) &= q_{0} , \\
\dot{p} (t) &= f(t, q(t), v(t)) , &
p(t_{0}) &= p_{0} , \\
p(t) &= ϑ(t, q(t), v(t))
\end{aligned}
```
with vector field ``f``, the momentum defined by ``p``, initial conditions ``(q_{0}, p_{0})`` and the solution
``(q,p)`` taking values in ``\mathbb{R}^{d} \times \mathbb{R}^{d}``.
This is a special case of a differential algebraic equation with dynamical
variables ``(q,p)`` and algebraic variable ``v``.

### Parameters

* `DT <: Number`: data type
* `TT <: Real`: time step type
* `AT <: AbstractArray{DT}`: array type
* `ϑType <: Function`: type of `ϑ`
* `fType <: Function`: type of `f`
* `gType <: Function`: type of `g`
* `v̄Type <: Function`: type of `v̄`
* `f̄Type <: Function`: type of `f̄`
* `hType <: OptionalFunction`: type of `h`
* `ΩType <: OptionalFunction`: type of `Ω`
* `∇HType <: OptionalFunction`: type of `∇H`
* `pType <: Union{NamedTuple,Nothing}`: parameters type

### Fields

* `d`: dimension of dynamical variables ``q`` and ``p`` as well as the vector fields ``f`` and ``p``
* `ϑ`: function determining the momentum
* `f`: function computing the vector field
* `g`: function determining the projection, given by ``\nabla \vartheta (q) \cdot \lambda``
* `v̄`: function computing an initial guess for the velocity field ``v`` (optional)
* `f̄`: function computing an initial guess for the force field ``f`` (optional)
* `h`: function computing the Hamiltonian (optional)
* `Ω`: symplectic matrix (optional)
* `∇H`: gradient of the Hamiltonian (optional)
* `t₀`: initial time (optional)
* `q₀`: initial condition for `q`
* `p₀`: initial condition for `p`
* `λ₀`: initial condition for `λ` (optional)
* `parameters`: either a `NamedTuple` containing the equations parameters or `nothing`
* `periodicity`: determines the periodicity of the state vector `q` for cutting periodic solutions

The functions `ϑ` and `f` must have the interface
```julia
    function ϑ(t, q, v, p)
        p[1] = ...
        p[2] = ...
        ...
    end
```
and
```julia
    function f(t, q, v, f)
        f[1] = ...
        f[2] = ...
        ...
    end
```
where `t` is the current time, `q` is the current solution vector, `v` is the
current velocity and `f` and `p` are the vectors which hold the result of
evaluating the functions ``f`` and ``ϑ`` on `t`, `q` and `v`.
The funtions `g` and `v` are specified by
```julia
    function g(t, q, λ, g)
        g[1] = ...
        g[2] = ...
        ...
    end
```
and
```julia
    function v(t, q, p, v)
        v[1] = ...
        v[2] = ...
        ...
    end
```

### Constructors

```julia
LODE(ϑ, f, g, t₀, q₀, p₀, λ₀; v̄=(t,q,v)->nothing, f̄=f, h=nothing, Ω=nothing, ∇H=nothing, parameters=nothing, periodicity=zero(q₀[begin]))
LODE(ϑ, f, g, q₀::StateVector, p₀::StateVector, λ₀::StateVector=zero(q₀); kwargs...) = LODE(ϑ, f, g, 0.0, q₀, p₀, λ₀; kwargs...)
LODE(ϑ, f, g, t₀, q₀::State, p₀::State, λ₀::State=zero(q₀); kwargs...) = LODE(ϑ, f, g, t₀, [q₀], [p₀], [λ₀]; kwargs...)
LODE(ϑ, f, g, q₀::State, p₀::State, λ₀::State=zero(q₀); kwargs...) = LODE(ϑ, f, g, 0.0, q₀, p₀, λ₀; kwargs...)
```

"""
struct LODE{dType <: Number, tType <: Real, arrayType <: AbstractArray{dType},
            ϑType <: Function, fType <: Function, gType <: Function,
            v̄Type <: Function, f̄Type <: Function, hType <: OptionalFunction,
            ΩType <: OptionalFunction, ∇HType <: OptionalFunction,
            pType <: Union{NamedTuple,Nothing}} <: AbstractEquationPODE{dType, tType}

    d::Int
    m::Int
    ϑ::ϑType
    f::fType
    g::gType
    v̄::v̄Type
    f̄::f̄Type
    h::hType
    Ω::ΩType
    ∇H::∇HType
    t₀::tType
    q₀::Vector{arrayType}
    p₀::Vector{arrayType}
    λ₀::Vector{arrayType}
    parameters::pType
    periodicity::arrayType

    function LODE(ϑ::ϑType, f::fType, g::gType, t₀::tType,
                q₀::Vector{arrayType}, p₀::Vector{arrayType}, λ₀::Vector{arrayType};
                v̄::v̄Type=(t,q,v)->nothing, f̄::f̄Type=f, h::hType=nothing, Ω::ΩType=nothing, ∇H::∇HType=nothing,
                parameters::pType=nothing, periodicity=zero(q₀[begin])) where {
                    dType <: Number, tType <: Real, arrayType <: AbstractArray{dType},
                    ϑType <: Function, fType <: Function, gType <: Function,
                    v̄Type <: Function, f̄Type <: Function,
                    hType <: OptionalFunction,
                    ΩType <: OptionalFunction,
                    ∇HType <: OptionalFunction,
                    pType <: Union{NamedTuple,Nothing}}

        d = length(q₀[begin])

        @assert length(q₀) == length(p₀)
        @assert all(length(q) == d for q in q₀)
        @assert all(length(p) == d for p in p₀)
        @assert all(length(λ) == d for λ in λ₀)

        new{dType, tType, arrayType, ϑType, fType, gType, v̄Type, f̄Type, hType, ΩType, ∇HType, pType}(d, d, ϑ, f, g, v̄, f̄, h, Ω, ∇H,
                t₀, q₀, p₀, λ₀, parameters, periodicity)
    end
end

LODE(ϑ, f, g, q₀::StateVector, p₀::StateVector, λ₀::StateVector=zero(q₀); kwargs...) = LODE(ϑ, f, g, 0.0, q₀, p₀, λ₀; kwargs...)
LODE(ϑ, f, g, t₀, q₀::State, p₀::State, λ₀::State=zero(q₀); kwargs...) = LODE(ϑ, f, g, t₀, [q₀], [p₀], [λ₀]; kwargs...)
LODE(ϑ, f, g, q₀::State, p₀::State, λ₀::State=zero(q₀); kwargs...) = LODE(ϑ, f, g, 0.0, q₀, p₀, λ₀; kwargs...)

const LODEHT{HT,DT,TT,AT,ϑT,FT,GT,V̄T,F̄T,ΩT,∇T,PT} = LODE{DT,TT,AT,ϑT,FT,GT,V̄T,F̄T,HT,ΩT,∇T,PT} # type alias for dispatch on Hamiltonian type parameter
const LODE∇T{∇T,DT,TT,AT,ϑT,FT,GT,V̄T,F̄T,HT,ΩT,PT} = LODE{DT,TT,AT,ϑT,FT,GT,V̄T,F̄T,HT,ΩT,∇T,PT} # type alias for dispatch on gradient of Hamiltonian type parameter
const LODEΩT{ΩT,DT,TT,AT,ϑT,FT,GT,V̄T,F̄T,HT,∇T,PT} = LODE{DT,TT,AT,ϑT,FT,GT,V̄T,F̄T,HT,ΩT,∇T,PT} # type alias for dispatch on symplectic two-form type parameter
const LODEPT{PT,DT,TT,AT,ϑT,FT,GT,V̄T,F̄T,HT,ΩT,∇T} = LODE{DT,TT,AT,ϑT,FT,GT,V̄T,F̄T,HT,ΩT,∇T,PT} # type alias for dispatch on parameters type parameter

Base.hash(ode::LODE, h::UInt) = hash(ode.d, hash(ode.m,
          hash(ode.ϑ, hash(ode.f, hash(ode.g, hash(ode.v̄, hash(ode.f̄,
          hash(ode.h, hash(ode.Ω, hash(ode.∇H,
          hash(ode.t₀, hash(ode.q₀, hash(ode.p₀, hash(ode.λ₀,
          hash(ode.parameters, hash(ode.periodicity, h))))))))))))))))

Base.:(==)(ode1::LODE, ode2::LODE) = (
                                ode1.d == ode2.d
                             && ode1.m == ode2.m
                             && ode1.ϑ == ode2.ϑ
                             && ode1.f == ode2.f
                             && ode1.g == ode2.g
                             && ode1.v̄ == ode2.v̄
                             && ode1.f̄ == ode2.f̄
                             && ode1.h == ode2.h
                             && ode1.Ω == ode2.Ω
                             && ode1.∇H == ode2.∇H
                             && ode1.t₀ == ode2.t₀
                             && ode1.q₀ == ode2.q₀
                             && ode1.p₀ == ode2.p₀
                             && ode1.λ₀ == ode2.λ₀
                             && ode1.parameters == ode2.parameters
                             && ode1.periodicity == ode2.periodicity)

function Base.similar(equ::LODE, t₀::Real, q₀::StateVector, p₀::StateVector, λ₀::StateVector;
                      v̄=equ.v̄, f̄=equ.f̄, h=equ.h, Ω=equ.Ω, ∇H=equ.∇H, parameters=equ.parameters, periodicity=equ.periodicity)
    @assert all([length(q) == ndims(equ) for q in q₀])
    @assert all([length(p) == ndims(equ) for p in p₀])
    @assert all([length(λ) == ndims(equ) for λ in λ₀])
    LODE(equ.ϑ, equ.f, equ.g, t₀, q₀, p₀, λ₀; v̄=v̄, f̄=f̄, h=h, Ω=Ω, ∇H=∇H, parameters=parameters, periodicity=periodicity)
end

Base.similar(equ::LODE, q₀, p₀, λ₀=get_λ₀(q₀, equ.λ₀); kwargs...) = similar(equ, equ.t₀, q₀, p₀, λ₀; kwargs...)
Base.similar(equ::LODE, t₀::Real, q₀::State, p₀::State, λ₀::State=get_λ₀(q₀, equ.λ₀); kwargs...) = similar(equ, t₀, [q₀], [p₀], [λ₀]; kwargs...)

Base.ndims(equ::LODE) = equ.d
Base.axes(equ::LODE) = axes(equ.q₀[begin])
Common.nsamples(equ::LODE) = length(equ.q₀)
Common.periodicity(equ::LODE) = equ.periodicity

initial_conditions(equation::LODE) = (equation.t₀, equation.q₀, equation.p₀, equation.λ₀)

hashamiltonian(::LODEHT{<:Nothing}) = false
hashamiltonian(::LODEHT{<:Function}) = true

hasgradientham(::LODE∇T{<:Nothing}) = false
hasgradientham(::LODE∇T{<:Function}) = true

hassymplecticform(::LODEΩT{<:Nothing}) = false
hassymplecticform(::LODEΩT{<:Function}) = true

hasparameters(::LODEPT{<:Nothing}) = false
hasparameters(::LODEPT{<:NamedTuple}) = true

_get_ϑ(equ::LODE) = hasparameters(equ) ? (t,q,v,ϑ) -> equ.ϑ(t, q, v, ϑ, equ.parameters) : equ.ϑ
_get_f(equ::LODE) = hasparameters(equ) ? (t,q,v,f) -> equ.f(t, q, v, f, equ.parameters) : equ.f
_get_g(equ::LODE) = hasparameters(equ) ? (t,q,v,g) -> equ.g(t, q, v, g, equ.parameters) : equ.g
_get_v̄(equ::LODE) = hasparameters(equ) ? (t,q,v) -> equ.v̄(t, q, v, equ.parameters) : equ.v̄
_get_f̄(equ::LODE) = hasparameters(equ) ? (t,q,v,f) -> equ.f̄(t, q, v, f, equ.parameters) : equ.f̄
_get_h(equ::LODE) = hasparameters(equ) ? (t,q) -> equ.h(t, q, equ.parameters) : equ.h
_get_∇(equ::LODE) = hasparameters(equ) ? (t,q,∇H) -> equ.∇H(t, q, ∇H, equ.parameters) : equ.∇H
_get_Ω(equ::LODE) = hasparameters(equ) ? (t,q,Ω) -> equ.Ω(t, q, Ω, equ.parameters) : equ.Ω


function get_function_tuple(equ::LODE)
    names = (:ϑ, :f, :g, :v̄, :f̄)
    equs  = (_get_ϑ(equ), _get_f(equ), _get_g(equ), _get_v̄(equ), _get_f̄(equ))

    if hashamiltonian(equ)
        names = (names..., :h)
        equs  = (equs..., _get_h(equ))
    end

    if hasgradientham(equ)
        names = (names..., :∇H)
        equs  = (equs..., _get_∇(equ))
    end

    if hassymplecticform(equ)
        names = (names..., :Ω)
        equs  = (equs..., _get_Ω(equ))
    end

    NamedTuple{names}(equs)
end
