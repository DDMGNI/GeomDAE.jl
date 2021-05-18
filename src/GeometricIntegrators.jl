module GeometricIntegrators

    using Reexport

    include("Utils.jl")
    using .Utils

    include("Config.jl")
    @reexport using .Config
    include("Common.jl")
    @reexport using .Common
    include("Equations.jl")
    @reexport using .Equations
    include("Solutions.jl")
    @reexport using .Solutions
    include("Discontinuities.jl")
    @reexport using .Discontinuities
    include("Integrators.jl")
    @reexport using .Integrators
    include("Simulations.jl")
    @reexport using .Simulations
    include("Tableaus.jl")
    @reexport using .Tableaus


    function __init__()
        add_config(:verbosity, 1)
    end

end
