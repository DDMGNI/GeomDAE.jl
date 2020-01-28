
#*****************************************************************************#
# Initialization functions for stochastic integrators                         #
#*****************************************************************************#

"Create integrator for stochastic explicit Runge-Kutta tableau."
function Integrator(equation::SDE, tableau::TableauSERK, Δt)
    IntegratorSERK(equation, tableau, Δt)
end

"Create integrator for weak explicit Runge-Kutta tableau."
function Integrator(equation::SDE, tableau::TableauWERK, Δt)
    IntegratorWERK(equation, tableau, Δt)
end

"Create integrator for stochastic fully implicit Runge-Kutta tableau."
function Integrator(equation::SDE, tableau::TableauSIRK, Δt; K::Int=0)
    IntegratorSIRK(equation, tableau, Δt, K=K)
end

"Create integrator for stochastic fully implicit partitioned Runge-Kutta tableau."
function Integrator(equation::PSDE, tableau::TableauSIPRK, Δt; K::Int=0)
    IntegratorSIPRK(equation, tableau, Δt, K=K)
end

"Create integrator for stochastic fully implicit split partitioned Runge-Kutta tableau."
function Integrator(equation::SPSDE, tableau::TableauSISPRK, Δt; K::Int=0)
    IntegratorSISPRK(equation, tableau, Δt, K=K)
end

"Create integrator for weak fully implicit Runge-Kutta tableau."
function Integrator(equation::SDE, tableau::TableauWIRK, Δt)
    IntegratorWIRK(equation, tableau, Δt)
end


#*****************************************************************************#
# Integration functions for stochastic integrators                            #
#*****************************************************************************#

"Integrate SDE for all sample paths and initial conditions."
function integrate!(int::StochasticIntegrator, sol::StochasticSolution)
    integrate!(int, sol, 1, sol.ns, 1, sol.ni)
end


"Integrate SDE for the sample paths k with k₁ ≤ k ≤ k₂ and initial conditions m with m₁ ≤ m ≤ m₂."
function integrate!(int::StochasticIntegrator, sol::StochasticSolution, k1::Int, k2::Int, m1::Int, m2::Int)
    # initialize integrator for initial conditions m with m₁ ≤ m ≤ m₂ and time step 0
    initialize!(int, sol, k1, k2, m1, m2)

    # integrate initial conditions m with m₁ ≤ m ≤ m₂ for all time steps
    integrate!(int, sol, k1, k2, m1, m2, 1, sol.ntime)
end


"Integrate SDE for the sample paths k with k₁ ≤ k ≤ k₂, the initial conditions m with m₁ ≤ m ≤ m₂, and the time steps n with n₁ ≤ n ≤ n₂."
function integrate!(int::StochasticIntegrator{DT,TT}, sol::StochasticSolution{DT,TT,N}, k1::Int, k2::Int, m1::Int, m2::Int, n1::Int, n2::Int) where {DT,TT,N}
    @assert k1 ≥ 1
    @assert k2 ≥ k1
    @assert k2 ≤ sol.ns

    @assert m1 ≥ 1
    @assert m2 ≥ m1
    @assert m2 ≤ sol.ni

    @assert n1 ≥ 1
    @assert n2 ≥ n1
    @assert n2 ≤ sol.ntime

    # loop over initial conditions
    for m in m1:m2
        # loop over sample paths
        for k in k1:k2
            # loop over time steps
            for n in n1:n2
                # try
                    # integrate one initial condition for one time step
                    integrate_step!(int, sol, k, m, n)
                # catch ex
                #     tstr = " in time step " * string(n)
                #
                #     if m1 ≠ m2
                #         tstr *= " for initial condition " * string(m)
                #     end
                #
                #     tstr *= "."
                #
                #     if isa(ex, DomainError)
                #         @warn("Domain error" * tstr)
                #     elseif isa(ex, ErrorException)
                #         @warn("Simulation exited early" * tstr)
                #         @warn(ex.msg)
                #         throw(ex)
                #     else
                #         @warn(string(typeof(ex)) * tstr)
                #         throw(ex)
                #     end
                # end
            end
        end
    end
end


"Initialize stochastic integrator for the sample paths k with k₁ ≤ k ≤ k₂, initial conditions m with m₁ ≤ m ≤ m₂ and time step 0."
function initialize!(int::StochasticIntegrator, sol::StochasticSolution, k1::Int, k2::Int, m1::Int, m2::Int)
    for m in m1:m2
        for k in k1:k2
            # initialize integrator for the sample path k, initial condition m and time step 0
            initialize!(int, sol, k, m)
        end
    end
end