
"Solution of a partitioned ordinary differential equation."
immutable SolutionPODE{dType, tType, N} <: Solution{dType, tType, N}
    nd::Int
    nt::Int
    n0::Int
    t::Timeseries{tType}
    x::Array{dType, N}
    q::AbstractArray{dType}
    p::AbstractArray{dType}
    ntime::Int
    nsave::Int

    function SolutionPODE(nd, n0, ntime, nsave, Δt)
        @assert dType <: Number
        @assert tType <: Real
        @assert nd > 0
        @assert n0 > 0
        @assert nsave > 0
        @assert ntime ≥ nsave
        @assert mod(ntime, nsave) == 0

        nt = div(ntime, nsave)
        t = Timeseries{tType}(nt, Δt, nsave)

        @assert N ∈ (3,4)

        if N == 3
            x = zeros(dType, 2, nd, nt+1)
            q = view(x, 1, :, :)
            p = view(x, 2, :, :)
        elseif N == 4
            x = zeros(dType, 2, nd, nt+1, n0)
            q = view(x, 1, :, :, :)
            p = view(x, 2, :, :, :)
        end

        new(nd, nt, n0, t, x, q, p, ntime, nsave)
    end
end

function SolutionPODE{DT,TT}(equation::Union{PODE{DT,TT}, IODE{DT,TT}}, Δt::TT, ntime::Int, nsave::Int=1)
    N = equation.n > 1 ? 4 : 3
    s = SolutionPODE{DT,TT,N}(equation.d, equation.n, ntime, nsave, Δt)
    set_initial_conditions!(s, equation)
    return s
end

function set_initial_conditions!{DT,TT}(solution::SolutionPODE{DT,TT,3}, equation::Union{PODE,IODE})
    for i in 1:size(solution,2)
        solution[1, i, 0] = equation.q₀[i]
        solution[2, i, 0] = equation.p₀[i]
    end
    solution.t[0] = equation.t₀
    compute_timeseries!(solution.t)
end

function set_initial_conditions!{DT,TT}(solution::SolutionPODE{DT,TT,4}, equation::Union{PODE,IODE})
    for k in 1:size(solution,4)
        for i in 1:size(solution,2)
            solution[1, i, 0, k] = equation.q₀[i,k]
            solution[2, i, 0, k] = equation.p₀[i,k]
        end
    end
    solution.t[0] = equation.t₀
    compute_timeseries!(solution.t)
end

function reset!{DT,TT}(s::SolutionPODE{DT,TT,3})
    for i in 1:size(solution,2)
        solution[1, i, 0] = solution[1, i, end]
        solution[2, i, 0] = solution[2, i, end]
    end
end

function reset!{DT,TT}(s::SolutionPODE{DT,TT,4})
    for k in 1:size(solution,4)
        for i in 1:size(solution,2)
            solution[1, i, 0, k] = solution[1, i, end, k]
            solution[2, i, 0, k] = solution[2, i, end, k]
        end
    end
end

Base.indices{DT,TT}(s::SolutionPODE{DT,TT,3}) = (1:2, 1:s.nd, 0:s.nt)
Base.indices{DT,TT}(s::SolutionPODE{DT,TT,4}) = (1:2, 1:s.nd, 0:s.nt, 1:s.n0)
Base.strides(s::SolutionPODE) = strides(s.x)

@inline function Base.getindex{DT,TT}(s::SolutionPODE{DT,TT,3}, j::Int, k::Int, m::Int)
    @boundscheck checkbounds(s.x, j, k, m+1)
    @inbounds r = getindex(s.x, j, k, m+1)
    return r
end

@inline function Base.getindex{DT,TT}(s::SolutionPODE{DT,TT,3}, k::Int, m::Int)
    @boundscheck checkbounds(s.x, :, k, m+1)
    @inbounds r = getindex(s.x, :, k, m+1)
    return r
end

@inline function Base.getindex{DT,TT}(s::SolutionPODE{DT,TT,3}, m::Int)
    @boundscheck checkbounds(s.x, :, :, m)
    @inbounds r = getindex(s.x, :, :, m)
    return r
end

@inline function Base.getindex{DT,TT}(s::SolutionPODE{DT,TT,4}, i::Int, j::Int, k::Int, m::Int)
    @boundscheck checkbounds(s.x, i, j, k+1, m)
    @inbounds r = getindex(s.x, i, j, k+1, m)
    return r
end

@inline function Base.getindex{DT,TT}(s::SolutionPODE{DT,TT,4}, j::Int, k::Int, m::Int)
    @boundscheck checkbounds(s.x, :, j, k+1, m)
    @inbounds r = getindex(s.x, :, j, k+1, m)
    return r
end

@inline function Base.getindex{DT,TT}(s::SolutionPODE{DT,TT,4}, k::Int, m::Int)
    @boundscheck checkbounds(s.x, :, :, k+1, m)
    @inbounds r = getindex(s.x, :, :, k+1, m)
    return r
end

@inline function Base.getindex{DT,TT}(s::SolutionPODE{DT,TT,4}, m::Int)
    @boundscheck checkbounds(s.x, :, :, :, m)
    @inbounds r = getindex(s.x, :, :, :, m)
    return r
end

@inline function Base.setindex!{DT,TT}(s::SolutionPODE{DT,TT,3}, x, j::Int, k::Int, m::Int)
    @assert length(x) == 1
    @boundscheck checkbounds(s.x, j, k, m+1)
    @inbounds setindex!(s.x, x, j, k, m+1)
end

@inline function Base.setindex!{DT,TT}(s::SolutionPODE{DT,TT,3}, x, k::Int, m::Int)
    @assert ndims(x) == 1
    @assert length(x) == 2
    @boundscheck checkbounds(s.x, :, k, m+1)
    @inbounds setindex!(s.x, x, :, k, m+1)
end

@inline function Base.setindex!{DT,TT}(s::SolutionPODE{DT,TT,3}, x, m::Int)
    @assert ndims(x) == 2
    @assert size(x, 1) == size(s.x, 1)
    @assert size(x, 2) == size(s.x, 2)
    @boundscheck checkbounds(s.x, :, :, m+1)
    @inbounds setindex!(s.x, x, :, :, m+1)
end
@inline function Base.setindex!{DT,TT}(s::SolutionPODE{DT,TT,4}, x, i::Int, j::Int, k::Int, m::Int)
    @assert length(x) == 1
    @boundscheck checkbounds(s.x, i, j, k+1, m)
    @inbounds setindex!(s.x, x, i, j, k+1, m)
end

@inline function Base.setindex!{DT,TT}(s::SolutionPODE{DT,TT,4}, x, j::Int, k::Int, m::Int)
    @assert ndims(x) == 1
    @assert length(x) == 2
    @boundscheck checkbounds(s.x, :, j, k+1, m)
    @inbounds setindex!(s.x, x, :, j, k+1, m)
end

@inline function Base.setindex!{DT,TT}(s::SolutionPODE{DT,TT,4}, x, k::Int, m::Int)
    @assert ndims(x) == 2
    @assert size(x, 1) == size(s.x, 1)
    @assert size(x, 2) == size(s.x, 2)
    @boundscheck checkbounds(s.x, :, :, k+1, m)
    @inbounds setindex!(s.x, x, :, :, k+1, m)
end

@inline function Base.setindex!{DT,TT}(s::SolutionPODE{DT,TT,4}, x, m::Int)
    @assert ndims(x) == 3
    @assert size(x, 1) == size(s.x, 1)
    @assert size(x, 2) == size(s.x, 2)
    @assert size(x, 3) == size(s.x, 3)
    @boundscheck checkbounds(s.x, :, :, :, m)
    @inbounds setindex!(s.x, x, :, :, :, m)
end
