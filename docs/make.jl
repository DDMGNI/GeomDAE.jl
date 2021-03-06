using Documenter
using DocumenterCitations
using Weave
using GeometricIntegrators

bib = CitationBibliography("GeometricIntegrators.bib")

makedocs(bib,
    sitename = "GeometricIntegrators.jl",
    format = Documenter.HTML(
               prettyurls = get(ENV, "CI", nothing) == "true",
               mathengine = MathJax3(Dict(
                 :tex => Dict(
                   :macros => Dict(
                     :bigtimes => "\\mathop{\\vcenter{\\huge\\times}}",
                     :ext => "\\mathsf{d}",
                     :id => "\\mathop{id}",
                     :rank => "\\mathop{rank}",
                     :spn => "\\mathop{span}",
                     :identity => "\\mathbb{I}",
                     :abs => ["\\left \\vert #1 \\right \\vert", 1],
                     :mf => ["\\mathcal{#1}", 1],
                     :tb => ["\\mathsf{T}_{#1} #2", 2, ""],
                     :cb => ["\\mathsf{T}_{#1}^{*} #2", 2, ""],
                   ),
                   :inlineMath => [["\$","\$"], ["\\(","\\)"]],
                   :tags => "ams",
                 ),
                 :options => Dict(
                   :ignoreHtmlClass => "tex2jax_ignore",
                   :processHtmlClass => "tex2jax_process",
                 ),
               ), true)
             ),
    pages = ["Home" => "index.md",
             "Tutorial" => "tutorial/tutorial.md",
             "Equations" => "equations.md",
             "Integrators" => [
                "Overview"    => "integrators.md",
                "Runge-Kutta" => "integrators/rk.md",
                "Splitting"   => "integrators/splitting.md",
                "Variational" => "integrators/variational.md",
                "VPRK"        => "integrators/vprk.md",
                "SPARK"       => "integrators/spark.md",
                "CGVI"        => "integrators/cgvi.md",
               #  "DGVI"        => "integrators/dgvi.md",
               #  "HPG"         => "integrators/hpg.md",
               ],
             "Modules" => [
               # "Discontinuities"     => "modules/discontinuities.md",
                "Equations"           => "modules/equations.md",
                "Integrators"         => "modules/integrators.md",
                "Simulations"         => "modules/simulations.md",
                "Solutions"           => "modules/solutions.md",
               ],
             "Tableaus" => [
                "Runge-Kutta Methods" => "tableaus/rungekutta.md",
                "Partitioned Runge-Kutta Methods" => "tableaus/rungekutta_partitioned.md",
                "Splitting Methods"   => "tableaus/splitting.md",
                "VPRK Methods"        => "tableaus/vprk.md",
                "SPARK Methods"       => "tableaus/spark.md",
               ],
             "Developer Docs" =>[
                "Code Integration"    => "developer/code_integration.md",
                "Custom Integrators"  => "developer/custom_integrators.md",
               ],
             "Release Notes" => "releasenotes.md",
             "Bibliography" => "bibliography.md",
             ]
)

deploydocs(
    repo   = "github.com/JuliaGNI/GeometricIntegrators.jl",
    push_preview = true,
)
