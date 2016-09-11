__precompile__()

module GeomDAE

include("utils/macro_utils.jl")
include("utils/matrix_utils.jl")

include("solvers/linear/linear_solvers.jl")
include("solvers/linear/lu_solver_lapack.jl")

export LinearSolver, LUSolverLAPACK,
       factorize!, solve!

include("solvers/nonlinear/nonlinear_solvers.jl")
include("solvers/nonlinear/jacobian.jl")
include("solvers/nonlinear/abstract_newton_solver.jl")
include("solvers/nonlinear/newton_solver.jl")
include("solvers/nonlinear/quasi_newton_solver.jl")

export NonlinearSolver, AbstractNewtonSolver, NewtonSolver, QuasiNewtonSolver,
       solve!

include("equations/equations.jl")

export Equation, ODE, PODE, DAE, PDAE

include("integrators/tableaus.jl")

export Tableau, TableauRK, TableauERK, TableauDIRK, TableauFIRK, TableauSIRK,
       TableauPRK, TableauSARK, TableauSPARK, TableauGLM,
       showTableau, writeTableauToFile, readTableauERKFromFile

include("integrators/tableaus_erk.jl")

export getTableauExplicitEuler, getTableauExplicitMidpoint, getTableauHeun,
       getTableauKutta, getTableauERK4, getTableauERK438

include("integrators/tableaus_dirk.jl")

export getTableauCrouzeix

include("integrators/tableaus_firk.jl")

export getTableauImplicitEuler, getTableauImplicitMidpoint,
       getTableauGLRK1, getTableauGLRK2, getTableauGLRK3

include("integrators/tableaus_prk.jl")

export getTableauSymplecticEulerA, getTableauSymplecticEulerB

include("integrators/solutions.jl")

export Solution, SolutionODE, SolutionPODE, SolutionDAE, SolutionPDAE,
       reset, set_initial_conditions!

include("integrators/integrators.jl")
include("integrators/integrators_erk.jl")
include("integrators/integrators_dirk.jl")
include("integrators/integrators_firk.jl")
include("integrators/integrators_prk.jl")
include("integrators/integrators_sark.jl")
include("integrators/integrators_spark.jl")

export Integrator, IntegratorERK, IntegratorDIRK, IntegratorFIRK,
       IntegratorPRK, IntegratorSARK, IntegratorSPARK,
       solve, solve!

include("utils/hdf5_utils.jl")

export createHDF5, writeSolutionToHDF5

end
