var documenterSearchIndex = {"docs": [

{
    "location": "index.html#",
    "page": "Home",
    "title": "Home",
    "category": "page",
    "text": ""
},

{
    "location": "index.html#GeometricIntegrators.jl-1",
    "page": "Home",
    "title": "GeometricIntegrators.jl",
    "category": "section",
    "text": "Julia library of geometric integrators for ordinary differential equations and differential algebraic equations.(Image: Build Status) (Image: Coverage Status) (Image: codecov)GeometricIntegrators.jl is a library of geometric integrators for ordinary differential equations and differential algebraic equations in Julia. Its main aim is the implementation and verification of novel geometric integrators, especially with respect to long-time stability and conservation of geometric structures. In order to be able to perform simulations with millions or billions of time steps, the design of the library tries to minimize overhead and maximize performance. For example, all data structures are preallocated and reused so that all runtime allocations are eliminated. GeometricIntegrators.jl provides solvers for various families of integrators as well as facilities to derive such integrators of arbitrary order, e.g., via discrete variational principles."
},

{
    "location": "index.html#Manual-1",
    "page": "Home",
    "title": "Manual",
    "category": "section",
    "text": "Pages = [\"tutorial.md\",\n         \"integrators.md\"]"
},

{
    "location": "index.html#Modules-1",
    "page": "Home",
    "title": "Modules",
    "category": "section",
    "text": "Pages = [\"modules/basis_functions.md\",\n         \"modules/equations.md\",\n         \"modules/integrators.md\",\n         \"modules/interpolation.md\",\n         \"modules/quadratures.md\",\n         \"modules/simulations.md\",\n         \"modules/solvers_linear.md\",\n         \"modules/solvers_nonlinear.md\",\n         \"modules/solutions.md\",\n         \"modules/tableaus.md\"\n]"
},

{
    "location": "index.html#Background-Material-1",
    "page": "Home",
    "title": "Background Material",
    "category": "section",
    "text": "Ernst Hairer and Christian Lubich. Numerical Solution of Ordinary Differential Equations. The Princeton Companion to Applied Mathematics, 293-305, 2015. Princeton University Press. (Author\'s Web Site)\nErnst Hairer, Christian Lubich and Gerhard Wanner. Geometric Numerical Integration Illustrated by the Störmer–Verlet Method. Acta Numerica 12, 399-450, 2003. (Journal)\nLaurent O. Jay. Lobatto Methods. Encyclopedia of Applied and Computational Mathematics, 817–826. Springer, 2015. (Article)"
},

{
    "location": "index.html#Useful-Books-on-the-Numerical-Integration-of-Ordinary-Differential-Equations-1",
    "page": "Home",
    "title": "Useful Books on the Numerical Integration of Ordinary Differential Equations",
    "category": "section",
    "text": "Ernst Hairer, Syvert P. Nørsett and Gerhard Wanner. Solving Ordinary Differential Equations I: Nonstiff Problems. Springer, 1993. (eBook)\nErnst Hairer and Gerhard Wanner. Solving Ordinary Differential Equations II: Stiff and Differential-Algebraic Problems. Springer, 1996. (eBook)\nPeter Deuflhard, Folkmar Bornemann. Scientific Computing with Ordinary Differential Equations. Springer, 2002. (eBook)\nJohn C. Butcher. Numerical Methods for Ordinary Differential Equations. Wiley, 2016. (eBook)\nErnst Hairer, Christian Lubich and Gerhard Wanner. Geometric Numerical Integration. Springer, 2006. (eBook)\nBenedict Leimkuhler and Sebastian Reich. Simulating Hamiltonian Dynamics. Cambridge University Press, 2005. (eBook)\nSergio Blanes, Fernando Casas. A Concise Introduction to Geometric Numerical Integration. CRC Press, 2016. (eBook)"
},

{
    "location": "index.html#License-1",
    "page": "Home",
    "title": "License",
    "category": "section",
    "text": "Copyright (c) 2016-2018 Michael Kraus <michael.kraus@ipp.mpg.de>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the \"Software\"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."
},

{
    "location": "tutorial.html#",
    "page": "Tutorial",
    "title": "Tutorial",
    "category": "page",
    "text": ""
},

{
    "location": "tutorial.html#Tutorial-1",
    "page": "Tutorial",
    "title": "Tutorial",
    "category": "section",
    "text": "In the simplest cases, the use of GeometricIntegrators.jl requires the construction of two objects, an equation and an integrator. The integrator is usually implicitly selected by specifying an equation and a tableau."
},

{
    "location": "tutorial.html#Equations-1",
    "page": "Tutorial",
    "title": "Equations",
    "category": "section",
    "text": "In GeometricIntegrators.jl we distinguish between three basic types of equations: ordinary differential equations (ODEs), differential algebraic equations (DAEs) and stochastic differential equations (SDEs). For each type, there are several subtypes like implicit equations (IODE, etc.), partitioned equations (PODE, etc.) or split equations (SODE, etc.).Instantiating an ODE object for the pendulum problem \\[ \\dot{x}1 = x2 , \\hspace{3em} \\dot{x}2 = \\sin (x1) , \\] can be achieved byfunction pendulum_rhs(t, x, f)\n    f[1] = x[2]\n    f[2] = sin(x[1])\nend\n\node = ODE(pendulum_rhs, [acos(0.4), 0.0])The first argument to the ODE constructor is the function that determines the vector field of the equation dotx (t) = f(t x(t)), and the second argument determines the initial conditions. The function defining the vector field has to take three arguments, the current time t, the current solution vector x and the output vector f.The pendulum problem is a Hamiltonian system that can also be expressed as \\[ \\dot{q} = \\frac{\\partial H}{\\partial p} = p , \\hspace{3em} \\dot{p} = - \\frac{\\partial H}{\\partial q} = \\sin (q) , \\hspace{3em} H (q,p) = \\frac{1}{2} p^2 + \\cos (q) . \\] This structure, namely the partitioning into two sets of variables (qp) instead of x, can be exploited for more efficient integration. Such equations can be defined in terms of a partitioned ODE, where the vector fields are specified separately,function pendulum_v(t, q, p, v)\n    v[1] = p[1]\nend\n\nfunction pendulum_f(t, q, p, f)\n    f[1] = sin(q[1])\nend\n\npode = PODE(pendulum_v, pendulum_f, [acos(0.4)], [0.0])The first two arguments to the PODE constructor are the functions that determine the vector fields of the equations dotq (t) = v(t q(t) p(t)) and dotp (t) = f(t q(t) p(t)). The third and fourth argument determines the initial conditions of q and p, respectively. The functions defining the vector field have to take four arguments, the current time t, the current solution vectors q and p and the output vector v or f."
},

{
    "location": "tutorial.html#Integrators-1",
    "page": "Tutorial",
    "title": "Integrators",
    "category": "section",
    "text": "We support a number of standard integrators (geometric and non-geometric) like explicit, implicit and partitioned Runge-Kutta methods, splitting methods and general linear methods (planned).In order to instantiate many of the standard integrators, one needs to specify an ODE, a tableau and a timestep, e.g.,int = Integrator(ode, getTableauExplicitEuler(), 0.1)In order to run the integrator, the integrate() functions is called, passing an integrator object and the number of time steps to integrate:sol = integrate(int, 10)The integrate function automatically creates an appropriate solution object, that contains the result of the integration.For a Hamiltonian system, defined as a PODE, a different tableau might be more appropriate, for example a symplectic Euler method,int = Integrator(pode, getTableauSymplecticEulerA(), 0.1)\nsol = integrate(int, 10)This creates a different integrator, which exploits the partitioned structure of the system. The solution return by the integrate step will also be a different solution, adapted to the partitioned system."
},

{
    "location": "tutorial.html#Tableaus-1",
    "page": "Tutorial",
    "title": "Tableaus",
    "category": "section",
    "text": "Many tableaus for Runge-Kutta methods are predefined and can easily be used like outlined above. In particular, this includes the following methods:"
},

{
    "location": "tutorial.html#Explicit-Runge-Kutta-Methods-1",
    "page": "Tutorial",
    "title": "Explicit Runge-Kutta Methods",
    "category": "section",
    "text": "Function Order Method\ngetTableauExplicitEuler() 1 Explicit / Forward Euler\ngetTableauExplicitMidpoint() 2 Explicit Midpoint\ngetTableauHeun() 2 Heun\'s Method\ngetTableauKutta() 3 Kutta\'s Method\ngetTableauERK4() 4 Explicit 4th order Runge-Kutta (1/6 rule)\ngetTableauERK438() 4 Explicit 4th order Runge-Kutta (3/8 rule)"
},

{
    "location": "tutorial.html#Fully-Implicit-Runge-Kutta-Methods-1",
    "page": "Tutorial",
    "title": "Fully Implicit Runge-Kutta Methods",
    "category": "section",
    "text": "Function Order Method\ngetTableauImplicitEuler() 1 Implicit / Backward Euler\ngetTableauImplicitMidpoint() 2 Implicit Midpoint\ngetTableauRadIIA2() 3 Radau-IIA s=2\ngetTableauRadIIA3() 5 Radau-IIA s=3\ngetTableauSRK3() 4 Symmetric Runge-Kutta s=3\ngetTableauGLRK(s) 2s Gauss-Legendre Runge-Kutta"
},

{
    "location": "tutorial.html#Explicit-Partitioned-Runge-Kutta-Methods-1",
    "page": "Tutorial",
    "title": "Explicit Partitioned Runge-Kutta Methods",
    "category": "section",
    "text": "Function Order Method\ngetTableauSymplecticEulerA() 1 Symplectic Euler A\ngetTableauSymplecticEulerB() 1 Symplectic Euler B\ngetTableauLobattoIIIAIIIB2() 2 Lobatto-IIIA-IIIB\ngetTableauLobattoIIIBIIIA2() 2 Lobatto-IIIB-IIIA"
},

{
    "location": "tutorial.html#Custom-Tableaus-1",
    "page": "Tutorial",
    "title": "Custom Tableaus",
    "category": "section",
    "text": "If required, it is straight-forward to create a custom tableau. The tableau of Heun\'s method, for example, is defined as follows:a = [[0.0 0.0]\n     [1.0 0.0]]\nb = [0.5, 0.5]\nc = [0.0, 1.0]\no = 2\n\ntab = TableauERK(:heun, o, a, b, c)Here, o is the order of the method, a are the coefficients, b the weights and c the nodes. TableauERK states that the method is explicit. Other choices include TableauFIRK for fully implicit Runge-Kutta methods, TableauDIRK for diagonally implicit and TableauSIRK for singly implicit Runge-Kutta methods. TableauEPRK and TableauIPRK can be used for explicit and implicit partitioned Runge-Kutta methods. The first parameter of the constructor of each tableau assigns a name to the tableau. Such custom tableaus can be used in exactly the same as standard tableaus, e.g., byint = Integrator(ode, tab, 0.1)\nsol = integrate(int, 10)making it very easy to implement and test new methods."
},

{
    "location": "tutorial.html#Solutions-1",
    "page": "Tutorial",
    "title": "Solutions",
    "category": "section",
    "text": "In what we have seen so far, the solution was always automatically created by the integrate() function. While this is often convenient, it is sometimes not performant, e.g., when carrying out long-time simulations with intermediate saving of the solution. In such cases, it is better to preallocate a solution object bysol = Solution(ode, 0.1, 10)where the first argument is an equation, the second argument is the time step and the third argument is the number of time steps that will be computed in one integration step. The call to the integrator is then made viaintegrate!(int, sol)If several integration cycles shall be performed, the reset!() function can be used to copy the solution of the last time step to the initial conditions of the solution,for i in 1:10\n    integrate!(int, sol)\n    #\n    # save or process solution\n    #\n    reset!(sol)\nendAll solutions have a t field holding the series of time steps that has been computed in addition to several data fields, for example q for an ODE solution, q and p for a PODE solution, qand λ for a DAE solution, and q, p and λ for a PDAE solution."
},

{
    "location": "integrators.html#",
    "page": "Overview",
    "title": "Overview",
    "category": "page",
    "text": ""
},

{
    "location": "integrators.html#Integrators-1",
    "page": "Overview",
    "title": "Integrators",
    "category": "section",
    "text": ""
},

{
    "location": "integrators/splitting.html#",
    "page": "Splitting",
    "title": "Splitting",
    "category": "page",
    "text": ""
},

{
    "location": "integrators/splitting.html#Splitting-Methods-1",
    "page": "Splitting",
    "title": "Splitting Methods",
    "category": "section",
    "text": ""
},

{
    "location": "integrators/rk.html#",
    "page": "Runge-Kutta",
    "title": "Runge-Kutta",
    "category": "page",
    "text": ""
},

{
    "location": "integrators/rk.html#Runge-Kutta-Methods-1",
    "page": "Runge-Kutta",
    "title": "Runge-Kutta Methods",
    "category": "section",
    "text": ""
},

{
    "location": "integrators/rk.html#Gauss-Lobatto-Runge-Kutta-Methods-1",
    "page": "Runge-Kutta",
    "title": "Gauss-Lobatto Runge-Kutta Methods",
    "category": "section",
    "text": "Function Order Method\ngetTableauLobIIIA2() 2 Gauss-Lobatto IIIA s=2\ngetTableauLobIIIA3() 4 Gauss-Lobatto IIIA s=3\ngetTableauLobIIIA4() 6 Gauss-Lobatto IIIA s=4\ngetTableauLobIIIB2() 2 Gauss-Lobatto IIIB s=2\ngetTableauLobIIIB3() 4 Gauss-Lobatto IIIB s=3\ngetTableauLobIIIB4() 6 Gauss-Lobatto IIIB s=4\ngetTableauLobIIIC2() 2 Gauss-Lobatto IIIC s=2\ngetTableauLobIIIC3() 4 Gauss-Lobatto IIIC s=3\ngetTableauLobIIIC4() 6 Gauss-Lobatto IIIC s=4\ngetTableauLobIIID2() 2 Gauss-Lobatto IIID s=2\ngetTableauLobIIID3() 4 Gauss-Lobatto IIID s=3\ngetTableauLobIIID4() 6 Gauss-Lobatto IIID s=4\ngetTableauLobIIIE2() 2 Gauss-Lobatto IIIE s=2\ngetTableauLobIIIE3() 4 Gauss-Lobatto IIIE s=3\ngetTableauLobIIIE4() 6 Gauss-Lobatto IIIE s=4\ngetTableauLobIIIF2() 4 Gauss-Lobatto IIIF s=2\ngetTableauLobIIIF3() 6 Gauss-Lobatto IIIF s=3\ngetTableauLobIIIF4() 8 Gauss-Lobatto IIIF s=4"
},

{
    "location": "integrators/vprk.html#",
    "page": "VPRK",
    "title": "VPRK",
    "category": "page",
    "text": ""
},

{
    "location": "integrators/vprk.html#Variational-Partitioned-Runge-Kutta-Integrators-1",
    "page": "VPRK",
    "title": "Variational Partitioned Runge-Kutta Integrators",
    "category": "section",
    "text": ""
},

{
    "location": "integrators/spark.html#",
    "page": "SPARK",
    "title": "SPARK",
    "category": "page",
    "text": ""
},

{
    "location": "integrators/spark.html#Special-Partitioned-Additive-Runge-Kutta-Integrators-1",
    "page": "SPARK",
    "title": "Special Partitioned Additive Runge-Kutta Integrators",
    "category": "section",
    "text": ""
},

{
    "location": "integrators/cgvi.html#",
    "page": "CGVI",
    "title": "CGVI",
    "category": "page",
    "text": ""
},

{
    "location": "integrators/cgvi.html#Continuous-Galerkin-Variational-Integrators-1",
    "page": "CGVI",
    "title": "Continuous Galerkin Variational Integrators",
    "category": "section",
    "text": ""
},

{
    "location": "integrators/dgvi.html#",
    "page": "DGVI",
    "title": "DGVI",
    "category": "page",
    "text": ""
},

{
    "location": "integrators/dgvi.html#Discontinuous-Galerkin-Variational-Integrators-1",
    "page": "DGVI",
    "title": "Discontinuous Galerkin Variational Integrators",
    "category": "section",
    "text": "\\[ \\delta \\sum \\limits{n=0}^{N-1} \\Bigg{     \\sum \\limits{i=1}^{s} bi \\, L \\big( qh (tn + ci h), \\, \\dot{q}h (tn + ci h) \\big)     + \\dfrac{1}{2} \\sum \\limits{i=1}^{\\sigma} \\betai \\, \\vartheta \\big( \\phi (\\gammai; q{n} , q{n}^+) \\big) \\, \\dfrac{d\\phi}{d\\tau} (\\gammai; q{n} , q{n}^+)     + \\dfrac{1}{2} \\sum \\limits{i=1}^{\\sigma} \\betai \\, \\vartheta \\big( \\phi (\\gammai; q{n+1}^- , q{n+1}) \\big) \\, \\dfrac{d\\phi}{d\\tau} (\\gammai; q{n+1}^- , q_{n+1}) \\Bigg} = 0 \\]"
},

{
    "location": "integrators/hpg.html#",
    "page": "HPG",
    "title": "HPG",
    "category": "page",
    "text": ""
},

{
    "location": "integrators/hpg.html#Hamilton-Pontryagin-Galerkin-Integrators-1",
    "page": "HPG",
    "title": "Hamilton-Pontryagin-Galerkin Integrators",
    "category": "section",
    "text": ""
},

{
    "location": "modules/basis_functions.html#",
    "page": "Basis Functions",
    "title": "Basis Functions",
    "category": "page",
    "text": ""
},

{
    "location": "modules/basis_functions.html#Basis-Functions-1",
    "page": "Basis Functions",
    "title": "Basis Functions",
    "category": "section",
    "text": "Modules = [GeometricIntegrators.BasisFunctions]\nOrder   = [:constant, :type, :macro, :function]"
},

{
    "location": "modules/equations.html#",
    "page": "Equations",
    "title": "Equations",
    "category": "page",
    "text": ""
},

{
    "location": "modules/equations.html#GeometricIntegrators.Equations.DAE",
    "page": "Equations",
    "title": "GeometricIntegrators.Equations.DAE",
    "category": "type",
    "text": "DAE: Differential Algebraic Equation\n\nDefines a differential algebraic initial value problem\n\nbeginalign*\ndotq (t) = v(t q(t)) + u(t q(t) lambda(t))   q(t_0) = q_0  \n0 = phi (t q(t) lambda(t))   lambda(t_0) = lambda_0 \nendalign*\n\nwith vector field v, projection u, algebraic constraint phi=0, initial conditions q_0 and lambda_0, the dynamical variable q taking values in mathbbR^m and the algebraic variable lambda taking values in mathbbR^n.\n\nFields\n\nd: dimension of dynamical variable q and the vector field v\nm: dimension of algebraic variable lambda and the constraint phi\nn: number of initial conditions\nv: function computing the vector field\nu: function computing the projection\nϕ: algebraic constraint\nt₀: initial time\nq₀: initial condition for dynamical variable q\nλ₀: initial condition for algebraic variable lambda\n\nThe function v, providing the vector field, takes three arguments, v(t, q, v), the functions u and ϕ, providing the projection and the algebraic constraint take four arguments, u(t, q, λ, u) and ϕ(t, q, λ, ϕ), where t is the current time, q and λ are the current solution vectors, and v, u and ϕ are the vectors which hold the result of evaluating the vector field v, the projection u and the algebraic constraint phi on t, q and λ.\n\nExample\n\n    function v(t, q, v)\n        v[1] = q[1]\n        v[2] = q[2]\n    end\n\n    function u(t, q, λ, u)\n        u[1] = +λ[1]\n        u[2] = -λ[1]\n    end\n\n    function ϕ(t, q, λ, ϕ)\n        ϕ[1] = q[2] - q[1]\n    end\n\n    t₀ = 0.\n    q₀ = [1., 1.]\n    λ₀ = [0.]\n\n    dae = DAE(v, u, ϕ, t₀, q₀, λ₀)\n\n\n\n\n\n\n"
},

{
    "location": "modules/equations.html#GeometricIntegrators.Equations.HDAE",
    "page": "Equations",
    "title": "GeometricIntegrators.Equations.HDAE",
    "category": "type",
    "text": "HDAE: Hamiltonian Differential Algebraic Equation\n\nDefines a Hamiltonian differential algebraic initial value problem, that is a canonical Hamiltonian system of equations subject to Dirac constraints,\n\nbeginalign*\ndotq (t) = v_1(t q(t) p(t)) + v_2(t q(t) p(t) lambda(t)) + v_3(t q(t) p(t) lambda(t) gamma(t))   q(t_0) = q_0  \ndotp (t) = f_1(t q(t) p(t)) + f_2(t q(t) p(t) lambda(t)) + f_3(t q(t) p(t) lambda(t) gamma(t))   p(t_0) = p_0  \n0 = phi (t q(t) p(t))  \n0 = psi (t q(t) p(t) lambda(t)) \nendalign*\n\nwith vector fields v_i and f_i for i = 1  3, primary constraint phi(qp)=0 and secondary constraint psi(qplambda)=0, initial conditions (q_0 p_0), the dynamical variables (qp) taking values in mathbbR^d times mathbbR^d and the algebraic variables (lambda gamma) taking values in mathbbR^n times mathbbR^d.\n\nFields\n\nd: dimension of dynamical variables q and p as well as the vector fields v and f\nm: dimension of algebraic variables lambda and gamma and the constraints phi and psi\nn: number of initial conditions\nv: tuple of functions computing the vector fields v_i, i = 1  3\nf: tuple of functions computing the vector fields f_i, i = 1  3\nϕ: primary constraints\nψ: secondary constraints\nt₀: initial time\nq₀: initial condition for dynamical variable q\np₀: initial condition for dynamical variable p\n\n\n\n\n\n"
},

{
    "location": "modules/equations.html#GeometricIntegrators.Equations.IDAE",
    "page": "Equations",
    "title": "GeometricIntegrators.Equations.IDAE",
    "category": "type",
    "text": "IDAE: Implicit Differential Algebraic Equation\n\nDefines a partitioned differential algebraic initial value problem\n\nbeginalign*\ndotq (t) = v(t) + u(t q(t) p(t) lambda(t))   q(t_0) = q_0  \ndotp (t) = f(t q(t) v(t)) + r(t q(t) p(t) lambda(t))   p(t_0) = p_0  \np(t) = p(t q(t) v(t))   \n0 = phi (t q(t) p(t) lambda(t))   lambda(t_0) = lambda_0 \nendalign*\n\nwith vector field f, the momentum defined by p, projection u and r, algebraic constraint phi=0, conditions (q_0 p_0) and lambda_0, the dynamical variables (qp) taking values in mathbbR^d times mathbbR^d and the algebraic variable lambda taking values in mathbbR^n.\n\nFields\n\nd: dimension of dynamical variables q and p as well as the vector fields f and p\nm: dimension of algebraic variable lambda and the constraint phi\nn: number of initial conditions\nf: function computing the vector field f\np: function computing p\nu: function computing the projection\ng: function computing the projection\nϕ: algebraic constraint\nt₀: initial time\nq₀: initial condition for dynamical variable q\np₀: initial condition for dynamical variable p\nλ₀: initial condition for algebraic variable lambda\n\n\n\n\n\n"
},

{
    "location": "modules/equations.html#GeometricIntegrators.Equations.IODE",
    "page": "Equations",
    "title": "GeometricIntegrators.Equations.IODE",
    "category": "type",
    "text": "IODE: Implicit Ordinary Differential Equation\n\nDefines an implicit initial value problem\n\nbeginalign*\ndotq (t) = v(t)  \nq(t_0) = q_0  \ndotp (t) = f(t q(t) v(t))  \np(t_0) = p_0  \np(t) = α(t q(t) v(t))\nendalign*\n\nwith vector field f, the momentum defined by p, initial conditions (q_0 p_0) and the solution (qp) taking values in mathbbR^d times mathbbR^d. This is a special case of a differential algebraic equation with dynamical variables (qp) and algebraic variable v.\n\nFields\n\nd: dimension of dynamical variables q and p as well as the vector fields f and p\nα: function determining the momentum\nf: function computing the vector field\ng: function determining the projection, given by ∇α(q)λ\nv: function computing an initial guess for the velocity field (optional)\nt₀: initial time (optional)\nq₀: initial condition for q\np₀: initial condition for p\n\nThe functions α and f must have the interface\n\n    function α(t, q, v, p)\n        p[1] = ...\n        p[2] = ...\n        ...\n    end\n\nand\n\n    function f(t, q, v, f)\n        f[1] = ...\n        f[2] = ...\n        ...\n    end\n\nwhere t is the current time, q is the current solution vector, v is the current velocity and f and p are the vectors which hold the result of evaluating the functions f and α on t, q and v. The funtions g and v are specified by\n\n    function g(t, q, λ, g)\n        g[1] = ...\n        g[2] = ...\n        ...\n    end\n\nand\n\n    function v(t, q, p, v)\n        v[1] = ...\n        v[2] = ...\n        ...\n    end\n\n\n\n\n\n"
},

{
    "location": "modules/equations.html#GeometricIntegrators.Equations.ODE",
    "page": "Equations",
    "title": "GeometricIntegrators.Equations.ODE",
    "category": "type",
    "text": "ODE: Ordinary Differential Equation\n\nDefines an initial value problem\n\ndotq (t) = v(t q(t))  qquad q(t_0) = q_0 \n\nwith vector field v, initial condition q_0 and the solution q taking values in mathbbR^d.\n\nFields\n\nd: dimension of dynamical variable q and the vector field v\nn: number of initial conditions\nv: function computing the vector field\nt₀: initial time\nq₀: initial condition\n\nThe function v providing the vector field must have the interface\n\n    function v(t, q, v)\n        v[1] = ...\n        v[2] = ...\n        ...\n    end\n\nwhere t is the current time, q is the current solution vector, and v is the vector which holds the result of evaluating the vector field v on t and q.\n\n\n\n\n\n"
},

{
    "location": "modules/equations.html#GeometricIntegrators.Equations.PDAE",
    "page": "Equations",
    "title": "GeometricIntegrators.Equations.PDAE",
    "category": "type",
    "text": "PDAE: Partitioned Differential Algebraic Equation\n\nDefines a partitioned differential algebraic initial value problem\n\nbeginalign*\ndotq (t) = v(t q(t) p(t)) + u(t q(t) p(t) lambda(t))   q(t_0) = q_0  \ndotp (t) = f(t q(t) p(t)) + r(t q(t) p(t) lambda(t))   p(t_0) = p_0  \n0 = phi (t q(t) p(t) lambda(t))   lambda(t_0) = lambda_0 \nendalign*\n\nwith vector fields v and f, projection u and r, algebraic constraint phi=0, conditions (q_0 p_0) and lambda_0, the dynamical variables (qp) taking values in mathbbR^d times mathbbR^d and the algebraic variable lambda taking values in mathbbR^n.\n\nFields\n\nd: dimension of dynamical variables q and p as well as the vector fields f and p\nm: dimension of algebraic variable lambda and the constraint phi\nn: number of initial conditions\nv: function computing the vector field v\nf: function computing the vector field f\nu: function computing the projection\ng: function computing the projection\nϕ: algebraic constraint\nt₀: initial time\nq₀: initial condition for dynamical variable q\np₀: initial condition for dynamical variable p\nλ₀: initial condition for algebraic variable lambda\n\n\n\n\n\n"
},

{
    "location": "modules/equations.html#GeometricIntegrators.Equations.PODE",
    "page": "Equations",
    "title": "GeometricIntegrators.Equations.PODE",
    "category": "type",
    "text": "IODE: Partitioned Ordinary Differential Equation\n\nDefines a partitioned initial value problem\n\nbeginalign*\ndotq (t) = v(t q(t) p(t))  \nq(t_0) = q_0  \ndotp (t) = f(t q(t) p(t))  \np(t_0) = p_0 \nendalign*\n\nwith vector fields v and f, initial conditions (q_0 p_0) and the solution (qp) taking values in mathbbR^d times mathbbR^d.\n\nFields\n\nd: dimension of dynamical variables q and p as well as the vector fields v and f\nv: function computing the vector field v\nf: function computing the vector field f\nt₀: initial time\nq₀: initial condition for q\np₀: initial condition for p\n\nThe functions v and f must have the interface\n\n    function v(t, q, p, v)\n        v[1] = ...\n        v[2] = ...\n        ...\n    end\n\nand\n\n    function f(t, q, p, f)\n        f[1] = ...\n        f[2] = ...\n        ...\n    end\n\nwhere t is the current time, q and p are the current solution vectors and v and f are the vectors which hold the result of evaluating the vector fields v and f on t, q and p.\n\n\n\n\n\n"
},

{
    "location": "modules/equations.html#GeometricIntegrators.Equations.SDE",
    "page": "Equations",
    "title": "GeometricIntegrators.Equations.SDE",
    "category": "type",
    "text": "SDE: Stochastic Differential Equation\n\nDefines a stochastic differential initial value problem\n\nbeginalign*\ndq (t) = v(t q(t))  dt + u(t q(t)) dW   q(t_0) = q_0 \nendalign*\n\nwith deterministic vector field v, stochastic vector field u, initial conditions q_0 and the dynamical variable q taking values in mathbbR^m.\n\nFields\n\nd: dimension of dynamical variable q and the vector field v\nn: number of initial conditions\nv: function computing the deterministic vector field\nu: function computing the stochastic vector field\nt₀: initial time\nq₀: initial condition for dynamical variable q\n\nThe functions v and u, providing the vector fields, take three arguments, v(t, q, v) and u(t, q, u), where t is the current time, q is the current solution vector, and v and u are the vectors which hold the result of evaluating the vector fields v and u on t and q.\n\nExample\n\n    function v(λ, t, q, v)\n        v[1] = λ*q[1]\n        v[2] = λ*q[2]\n    end\n\n    function u(μ, t, q, u)\n        u[1] = μ*q[1]\n        u[2] = μ*q[2]\n    end\n\n    t₀ = 0.\n    q₀ = [1., 1.]\n    λ  = 2.\n    μ  = 1.\n\n    v_sde = (t, q, v) -> v(λ, t, q, v)\n    u_sde = (t, q, v) -> u(μ, t, q, v)\n\n    sde = SDE(v_sde, u_sde, t₀, q₀)\n\n\n\n\n\n"
},

{
    "location": "modules/equations.html#GeometricIntegrators.Equations.SODE",
    "page": "Equations",
    "title": "GeometricIntegrators.Equations.SODE",
    "category": "type",
    "text": "SODE: Split Ordinary Differential Equation\n\nDefines an initial value problem\n\ndotq (t) = v(t q(t))  qquad q(t_0) = q_0 \n\nwith vector field v, initial condition q_0 and the solution q taking values in mathbbR^d. Here, the vector field v is given as a sum of vector fields\n\nv (t) = v_1 (t) +  + v_r (t) \n\nFields\n\nd: dimension of dynamical variable q and the vector field v\nv: tuple of functions computing the vector field\nt₀: initial time\nq₀: initial condition\n\nThe functions v_i providing the vector field must have the interface\n\n    function v_i(t, q₀, q₁, h)\n        q₁[1] = q₀[1] + ...\n        q₁[2] = q₀[2] + ...\n        ...\n    end\n\nwhere t is the current time, q₀ is the current solution vector, q₁ is the new solution vector which holds the result of computing one substep with the vector field v_i on t and q₀, and h is the (sub-)timestep to compute the update for.\n\nThe fact that the function v returns the solution and not just the vector field for each substep increases the flexibility for the use of splitting methods, e.g., it allows to use another integrator for solving substeps.\n\n\n\n\n\n"
},

{
    "location": "modules/equations.html#GeometricIntegrators.Equations.VODE",
    "page": "Equations",
    "title": "GeometricIntegrators.Equations.VODE",
    "category": "type",
    "text": "VODE: Variational Ordinary Differential Equation\n\nDefines an implicit initial value problem\n\nbeginalign*\ndotq (t) = v(t)  \nq(t_0) = q_0  \ndotp (t) = f(t q(t) v(t))  \np(t_0) = p_0  \np(t) = α(t q(t) v(t))\nendalign*\n\nwith vector field f, the momentum defined by p, initial conditions (q_0 p_0) and the solution (qp) taking values in mathbbR^d times mathbbR^d. This is a special case of a differential algebraic equation with dynamical variables (qp) and algebraic variable v.\n\nFields\n\nd: dimension of dynamical variables q and p as well as the vector fields f and p\nα: function determining the momentum\nf: function computing the vector field\ng: function determining the projection, given by ∇α(q)λ\nv: function computing an initial guess for the velocity field (optional)\nt₀: initial time (optional)\nq₀: initial condition for q\np₀: initial condition for p\nλ₀: initial condition for λ\n\nThe functions α and f must have the interface\n\n    function α(t, q, v, p)\n        p[1] = ...\n        p[2] = ...\n        ...\n    end\n\nand\n\n    function f(t, q, v, f)\n        f[1] = ...\n        f[2] = ...\n        ...\n    end\n\nwhere t is the current time, q is the current solution vector, v is the current velocity and f and p are the vectors which hold the result of evaluating the functions f and α on t, q and v. The funtions g and v are specified by\n\n    function g(t, q, λ, g)\n        g[1] = ...\n        g[2] = ...\n        ...\n    end\n\nand\n\n    function v(t, q, p, v)\n        v[1] = ...\n        v[2] = ...\n        ...\n    end\n\n\n\n\n\n"
},

{
    "location": "modules/equations.html#Equations-1",
    "page": "Equations",
    "title": "Equations",
    "category": "section",
    "text": "Modules = [GeometricIntegrators.Equations]\nOrder   = [:constant, :type, :macro, :function]"
},

{
    "location": "modules/integrators.html#",
    "page": "Integrators",
    "title": "Integrators",
    "category": "page",
    "text": ""
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.AbstractTableau",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.AbstractTableau",
    "category": "type",
    "text": "Holds the information for the various methods\' tableaus.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.AbstractTableauIRK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.AbstractTableauIRK",
    "category": "type",
    "text": "Holds the tableau of an implicit Runge-Kutta method.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.AbstractTableauPRK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.AbstractTableauPRK",
    "category": "type",
    "text": "Holds the tableau of a partitioned Runge-Kutta method.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.AbstractTableauRK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.AbstractTableauRK",
    "category": "type",
    "text": "Holds the tableau of a Runge-Kutta method.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.CoefficientsARK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.CoefficientsARK",
    "category": "type",
    "text": "Holds the coefficients of an additive Runge-Kutta method.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.CoefficientsMRK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.CoefficientsMRK",
    "category": "type",
    "text": "Holds the multiplier Runge-Kutta coefficients.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.CoefficientsPGLRK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.CoefficientsPGLRK",
    "category": "type",
    "text": "Holds the coefficients of a projected Gauss-Legendre Runge-Kutta method.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.CoefficientsPRK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.CoefficientsPRK",
    "category": "type",
    "text": "Holds the coefficients of a projective Runge-Kutta method.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.CoefficientsRK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.CoefficientsRK",
    "category": "type",
    "text": "Holds the coefficients of a Runge-Kutta method.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.Integrator-Tuple{DAE,TableauARK,Any}",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.Integrator",
    "category": "method",
    "text": "Create integrator for additive Runge-Kutta tableau.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.Integrator-Tuple{DAE,TableauSARK,Any}",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.Integrator",
    "category": "method",
    "text": "Create integrator for special additive Runge-Kutta tableau.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.Integrator-Tuple{Equation,AbstractTableau,Any}",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.Integrator",
    "category": "method",
    "text": "Print error for integrators not implemented, yet.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.Integrator-Tuple{IDAE,TableauVPARK,Any}",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.Integrator",
    "category": "method",
    "text": "Create integrator for variational partitioned additive Runge-Kutta tableau.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.Integrator-Tuple{IDAE,TableauVSPARK,Any}",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.Integrator",
    "category": "method",
    "text": "Create integrator for variational special partitioned additive Runge-Kutta tableau.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.Integrator-Tuple{IODE,CoefficientsPGLRK,Any}",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.Integrator",
    "category": "method",
    "text": "Create integrator for Projected Gauss-Legendre Runge-Kutta tableau.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.Integrator-Tuple{IODE,TableauVPRK,Any}",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.Integrator",
    "category": "method",
    "text": "Create integrator for variational partitioned Runge-Kutta tableau.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.Integrator-Tuple{ODE,TableauDIRK,Any}",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.Integrator",
    "category": "method",
    "text": "Create integrator for diagonally implicit Runge-Kutta tableau.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.Integrator-Tuple{ODE,TableauERK,Any}",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.Integrator",
    "category": "method",
    "text": "Create integrator for explicit Runge-Kutta tableau.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.Integrator-Tuple{ODE,TableauFIRK,Any}",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.Integrator",
    "category": "method",
    "text": "Create integrator for fully implicit Runge-Kutta tableau.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.Integrator-Tuple{ODE,TableauSIRK,Any}",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.Integrator",
    "category": "method",
    "text": "Create integrator for singly implicit Runge-Kutta tableau.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.Integrator-Tuple{PDAE,TableauPARK,Any}",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.Integrator",
    "category": "method",
    "text": "Create integrator for partitioned additive Runge-Kutta tableau.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.Integrator-Tuple{PDAE,TableauSPARK,Any}",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.Integrator",
    "category": "method",
    "text": "Create integrator for special partitioned additive Runge-Kutta tableau.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.Integrator-Tuple{PODE,TableauEPRK,Any}",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.Integrator",
    "category": "method",
    "text": "Create integrator for explicit partitioned Runge-Kutta tableau.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.Integrator-Tuple{PODE,TableauIPRK,Any}",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.Integrator",
    "category": "method",
    "text": "Create integrator for implicit partitioned Runge-Kutta tableau.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.Integrator-Tuple{SODE,AbstractTableauSplitting,Any}",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.Integrator",
    "category": "method",
    "text": "Create integrator for splitting tableau.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.Integrator-Tuple{VODE,TableauFIRK,Any}",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.Integrator",
    "category": "method",
    "text": "Create integrator for formal Lagrangian Runge-Kutta tableau.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.IntegratorCGVI",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.IntegratorCGVI",
    "category": "type",
    "text": "Continuous Galerkin Variational Integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.IntegratorDGVI",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.IntegratorDGVI",
    "category": "type",
    "text": "Discontinuous Galerkin Variational Integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.IntegratorDIRK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.IntegratorDIRK",
    "category": "type",
    "text": "Diagonally implicit Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.IntegratorEPRK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.IntegratorEPRK",
    "category": "type",
    "text": "Explicit partitioned Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.IntegratorERK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.IntegratorERK",
    "category": "type",
    "text": "Explicit Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.IntegratorFIRK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.IntegratorFIRK",
    "category": "type",
    "text": "Fully implicit Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.IntegratorFLRK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.IntegratorFLRK",
    "category": "type",
    "text": "Formal Lagrangian Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.IntegratorGPARK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.IntegratorGPARK",
    "category": "type",
    "text": "Special Partitioned Additive Runge Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.IntegratorHSPARK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.IntegratorHSPARK",
    "category": "type",
    "text": "Hamiltonian Specialised Partitioned Additive Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.IntegratorIPRK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.IntegratorIPRK",
    "category": "type",
    "text": "Implicit partitioned Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.IntegratorPARK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.IntegratorPARK",
    "category": "type",
    "text": "Implicit partitioned additive Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.IntegratorPGLRK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.IntegratorPGLRK",
    "category": "type",
    "text": "Variational partitioned Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.IntegratorSIRK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.IntegratorSIRK",
    "category": "type",
    "text": "Singly implicit Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.IntegratorSPARK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.IntegratorSPARK",
    "category": "type",
    "text": "Variational special partitioned additive Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.IntegratorSplitting",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.IntegratorSplitting",
    "category": "type",
    "text": "Splitting integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.IntegratorSplitting-Union{Tuple{ST}, Tuple{VT}, Tuple{TT}, Tuple{DT}, Tuple{SODE{DT,TT,VT,N} where N,ST,TT}} where ST<:TableauSplittingGS{TT} where VT where TT where DT",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.IntegratorSplitting",
    "category": "method",
    "text": "Construct splitting integrator for symmetric splitting tableau with general stages.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.IntegratorSplitting-Union{Tuple{ST}, Tuple{VT}, Tuple{TT}, Tuple{DT}, Tuple{SODE{DT,TT,VT,N} where N,ST,TT}} where ST<:TableauSplittingNS{TT} where VT where TT where DT",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.IntegratorSplitting",
    "category": "method",
    "text": "Construct splitting integrator for non-symmetric splitting tableau with general stages.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.IntegratorSplitting-Union{Tuple{ST}, Tuple{VT}, Tuple{TT}, Tuple{DT}, Tuple{SODE{DT,TT,VT,N} where N,ST,TT}} where ST<:TableauSplittingSS{TT} where VT where TT where DT",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.IntegratorSplitting",
    "category": "method",
    "text": "Construct splitting integrator for symmetric splitting tableau with symmetric stages.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.IntegratorVPARK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.IntegratorVPARK",
    "category": "type",
    "text": "Variational partitioned additive Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.IntegratorVPRK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.IntegratorVPRK",
    "category": "type",
    "text": "Variational partitioned Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.IntegratorVPRKpLegendre",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.IntegratorVPRKpLegendre",
    "category": "type",
    "text": "Variational special partitioned additive Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.IntegratorVPRKpMidpoint",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.IntegratorVPRKpMidpoint",
    "category": "type",
    "text": "Variational partitioned Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.IntegratorVPRKpSecondary",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.IntegratorVPRKpSecondary",
    "category": "type",
    "text": "Variational partitioned Runge-Kutta integrator with projection on secondary constraint.\n\nbeginalign*\nP_ni = dfracpartial Lpartial v (Q_ni V_ni)  \nQ_ni = q_n + h sum limits_j=1^s a_ij  big( V_nj + Lambda_nj big)  \nq_n+1 = q_n + h sum limits_i=1^s b_i  big( V_ni + Lambda_ni big)  \nF_ni = dfracpartial Lpartial q (Q_ni V_ni)  \nP_ni = p_n + h sum limits_i=1^s bara_ij  big( F_nj + nabla vartheta (Q_nj) cdot Lambda_nj big) - d_i lambda  \np_n+1 = p_n + h sum limits_i=1^s barb_i  big( F_ni + nabla vartheta (Q_nj) cdot Lambda_nj big)  \n0 = sum limits_i=1^s d_i V_i  \n0 = sum limits_j=1^s omega_ij Psi_nj  \n0 = phi (q_n+1 p_n+1) \nendalign*\n\nsatisfying the symplecticity conditions\n\nbeginalign*\nb_i bara_ij + barb_j a_ji = b_i barb_j  \nbarb_i = b_i \nendalign*\n\nthe primary constraint,\n\nbeginalign*\nphi(qp) = p - vartheta (q) = 0 \nendalign*\n\nat the final solution (q_n+1 p_n+1), and super positions of the secondary constraints,\n\nbeginalign*\npsi(qdotqpdotp)\n= dotp - dotq cdot nabla vartheta (q)\n= big( nabla vartheta (q) - nabla vartheta^T (q) big) cdot dotq - nabla H (q)\n= 0\nendalign*\n\nat the internal stages,\n\nbeginalign*\nPsi_nj = big( nabla vartheta (Q_nj) - nabla vartheta^T (Q_nj) big) cdot V_nj - nabla H (Q_nj) \nendalign*\n\nHere, omega is a (s-1) times s matrix, chosen such that the resulting method has optimal order. The vector d is zero for Gauss-Legendre methods and needs to be chosen appropriately for Gauss-Lobatto methods (for details see documentation of VPRK methods).\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.IntegratorVPRKpStandard",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.IntegratorVPRKpStandard",
    "category": "type",
    "text": "Variational partitioned Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.IntegratorVPRKpSymmetric",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.IntegratorVPRKpSymmetric",
    "category": "type",
    "text": "Variational partitioned Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.IntegratorVPRKpVariational",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.IntegratorVPRKpVariational",
    "category": "type",
    "text": "Variational partitioned Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.IntegratorVSPARK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.IntegratorVSPARK",
    "category": "type",
    "text": "Variational Specialised Partitioned Additive Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.TableauARK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.TableauARK",
    "category": "type",
    "text": "Holds the tableau of a additive Runge-Kutta method.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.TableauDIRK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.TableauDIRK",
    "category": "type",
    "text": "Holds the tableau of a diagonally implicit Runge-Kutta method.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.TableauEPRK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.TableauEPRK",
    "category": "type",
    "text": "TableauEPRK: Tableau of an Explicit Partitioned Runge-Kutta method\n\nbeginalign*\nV_ni = hphantom- dfracpartial Hpartial p (Q_ni P_ni)  \nQ_ni = q_n + h sum limits_j=1^s a_ij  V_nj  \nq_n+1 = q_n + h sum limits_i=1^s b_i  V_ni  \nF_ni = - dfracpartial Hpartial q (Q_ni P_ni)  \nP_ni = p_n + h  sum limits_i=1^s bara_ij  F_nj  \np_n+1 = p_n + h sum limits_i=1^s barb_i  F_ni \nendalign*\n\nusually satisfying the symplecticity conditions\n\nbeginalign*\nb_i bara_ij + b_j a_ji = b_i b_j  \nbarb_i = b_i \nendalign*\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.TableauERK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.TableauERK",
    "category": "type",
    "text": "Holds the tableau of an explicit Runge-Kutta method.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.TableauFIRK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.TableauFIRK",
    "category": "type",
    "text": "Holds the tableau of a fully implicit Runge-Kutta method.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.TableauGLM",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.TableauGLM",
    "category": "type",
    "text": "Holds the tableau of a general linear method.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.TableauGPARK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.TableauGPARK",
    "category": "type",
    "text": "Holds the tableau of a spezialized partitioned additive Runge-Kutta method.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.TableauHSPARK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.TableauHSPARK",
    "category": "type",
    "text": "Holds the tableau of an Hamiltonian Specialised Partitioned Additive Runge-Kutta method.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.TableauIPRK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.TableauIPRK",
    "category": "type",
    "text": "TableauIPRK: Tableau of an Implicit Partitioned Runge-Kutta method\n\nbeginalign*\nP_ni = dfracpartial Lpartial v (Q_ni V_ni)  \nQ_ni = q_n + h sum limits_j=1^s a_ij  V_nj  \nq_n+1 = q_n + h sum limits_i=1^s b_i  V_ni  \nF_ni = dfracpartial Lpartial q (Q_ni V_ni)  \nP_ni = p_n + h  sum limits_i=1^s bara_ij  F_nj  \np_n+1 = p_n + h sum limits_i=1^s barb_i  F_ni \nendalign*\n\nusually satisfying the symplecticity conditions\n\nbeginalign*\nb_i bara_ij + b_j a_ji = b_i b_j  \nbarb_i = b_i \nendalign*\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.TableauPARK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.TableauPARK",
    "category": "type",
    "text": "Holds the tableau of an partitioned additive Runge-Kutta method.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.TableauSARK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.TableauSARK",
    "category": "type",
    "text": "Holds the tableau of a spezialized additive Runge-Kutta method.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.TableauSIRK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.TableauSIRK",
    "category": "type",
    "text": "Holds the tableau of a singly implicit Runge-Kutta method.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.TableauSPARK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.TableauSPARK",
    "category": "type",
    "text": "Holds the tableau of an Specialised Partitioned Additive Runge-Kutta method.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.TableauSplittingGS",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.TableauSplittingGS",
    "category": "type",
    "text": "Tableau for symmetric splitting methods with general stages.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.TableauSplittingNS",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.TableauSplittingNS",
    "category": "type",
    "text": "Tableau for non-symmetric splitting methods.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.TableauSplittingSS",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.TableauSplittingSS",
    "category": "type",
    "text": "Tableau for symmetric splitting methods with symmetric stages.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.TableauVPARK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.TableauVPARK",
    "category": "type",
    "text": "Holds the tableau of an variational partitioned additive Runge-Kutta method.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.TableauVPRK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.TableauVPRK",
    "category": "type",
    "text": "TableauVPRK: Tableau of a Variational Partitioned Runge-Kutta method\n\nbeginalign*\nP_ni = dfracpartial Lpartial v (Q_ni V_ni)  \nQ_ni = q_n + h sum limits_j=1^s a_ij  V_nj  \nq_n+1 = q_n + h sum limits_i=1^s b_i  V_ni  \nF_ni = dfracpartial Lpartial q (Q_ni V_ni)  \nP_ni = p_n + h sum limits_i=1^s bara_ij  F_nj - d_i lambda  \np_n+1 = p_n + h sum limits_i=1^s barb_i  F_ni  \n\n0 = sum limits_i=1^s d_i V_i  \nendalign*\n\nsatisfying the symplecticity conditions\n\nbeginalign*\nb_i bara_ij + b_j a_ji = b_i b_j  \nbarb_i = b_i \nendalign*\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.TableauVSPARK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.TableauVSPARK",
    "category": "type",
    "text": "Holds the tableau of an Variational Specialised Partitioned Additive Runge-Kutta method.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.function_stages!-Union{Tuple{FR}, Tuple{QR}, Tuple{S}, Tuple{D}, Tuple{GT}, Tuple{FT}, Tuple{ΘT}, Tuple{TT}, Tuple{DT}, Tuple{ST}, Tuple{Array{ST,1},Array{ST,1},ParametersDGVI{DT,TT,ΘT,FT,GT,D,S,QR,FR}}} where FR where QR where S where D where GT where FT where ΘT where TT where DT where ST",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.function_stages!",
    "category": "method",
    "text": "Compute stages of variational partitioned Runge-Kutta methods.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.function_stages!-Union{Tuple{GT}, Tuple{FT}, Tuple{ΑT}, Tuple{TT}, Tuple{DT}, Tuple{Array{DT,1},Array{DT,1},ParametersPGLRK{DT,TT,ΑT,FT,GT}}} where GT where FT where ΑT where TT where DT",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.function_stages!",
    "category": "method",
    "text": "Compute stages of variational partitioned Runge-Kutta methods.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.function_stages!-Union{Tuple{R}, Tuple{S}, Tuple{D}, Tuple{FT}, Tuple{ΘT}, Tuple{TT}, Tuple{DT}, Tuple{ST}, Tuple{Array{ST,1},Array{ST,1},ParametersCGVI{DT,TT,ΘT,FT,D,S,R}}} where R where S where D where FT where ΘT where TT where DT where ST",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.function_stages!",
    "category": "method",
    "text": "Compute stages of variational partitioned Runge-Kutta methods.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.function_stages!-Union{Tuple{S}, Tuple{D}, Tuple{ET}, Tuple{TT}, Tuple{DT}, Tuple{ST}, Tuple{Array{ST,1},Array{ST,1},ParametersFIRK{DT,TT,ET,D,S}}} where S where D where ET where TT where DT where ST",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.function_stages!",
    "category": "method",
    "text": "Compute stages of fully implicit Runge-Kutta methods.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.function_stages!-Union{Tuple{S}, Tuple{D}, Tuple{ET}, Tuple{TT}, Tuple{DT}, Tuple{ST}, Tuple{Array{ST,1},Array{ST,1},ParametersIPRK{DT,TT,ET,D,S}}} where S where D where ET where TT where DT where ST",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.function_stages!",
    "category": "method",
    "text": "Compute stages of implicit partitioned Runge-Kutta methods.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.function_stages!-Union{Tuple{S}, Tuple{D}, Tuple{ET}, Tuple{TT}, Tuple{DT}, Tuple{ST}, Tuple{Array{ST,1},Array{ST,1},ParametersVPRKpMidpoint{DT,TT,ET,D,S}}} where S where D where ET where TT where DT where ST",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.function_stages!",
    "category": "method",
    "text": "Compute stages of variational partitioned Runge-Kutta methods.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.function_stages!-Union{Tuple{S}, Tuple{D}, Tuple{ET}, Tuple{TT}, Tuple{DT}, Tuple{ST}, Tuple{Array{ST,1},Array{ST,1},ParametersVPRKpSecondary{DT,TT,ET,D,S}}} where S where D where ET where TT where DT where ST",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.function_stages!",
    "category": "method",
    "text": "Compute stages of variational partitioned Runge-Kutta methods.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.function_stages!-Union{Tuple{S}, Tuple{D}, Tuple{ET}, Tuple{TT}, Tuple{DT}, Tuple{ST}, Tuple{Array{ST,1},Array{ST,1},ParametersVPRKpStandard{DT,TT,ET,D,S}}} where S where D where ET where TT where DT where ST",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.function_stages!",
    "category": "method",
    "text": "Compute stages of projected variational partitioned Runge-Kutta methods.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.function_stages!-Union{Tuple{S}, Tuple{D}, Tuple{ET}, Tuple{TT}, Tuple{DT}, Tuple{ST}, Tuple{Array{ST,1},Array{ST,1},ParametersVPRKpSymmetric{DT,TT,ET,D,S}}} where S where D where ET where TT where DT where ST",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.function_stages!",
    "category": "method",
    "text": "Compute stages of variational partitioned Runge-Kutta methods.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.function_stages!-Union{Tuple{S}, Tuple{D}, Tuple{ET}, Tuple{TT}, Tuple{DT}, Tuple{ST}, Tuple{Array{ST,1},Array{ST,1},ParametersVPRKpVariational{DT,TT,ET,D,S}}} where S where D where ET where TT where DT where ST",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.function_stages!",
    "category": "method",
    "text": "Compute stages of projected variational partitioned Runge-Kutta methods.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.function_stages!-Union{Tuple{S}, Tuple{D}, Tuple{ET}, Tuple{TT}, Tuple{DT}, Tuple{ST}, Tuple{Array{ST,1},Array{ST,1},ParametersVPRK{DT,TT,ET,D,S}}} where S where D where ET where TT where DT where ST",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.function_stages!",
    "category": "method",
    "text": "Compute stages of variational partitioned Runge-Kutta methods.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.function_stages!-Union{Tuple{S}, Tuple{D}, Tuple{FT}, Tuple{ΘT}, Tuple{TT}, Tuple{DT}, Tuple{ST}, Tuple{Array{ST,1},Array{ST,1},ParametersVPRKpLegendre{DT,TT,ΘT,FT,D,S}}} where S where D where FT where ΘT where TT where DT where ST",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.function_stages!",
    "category": "method",
    "text": "Compute stages of variational special partitioned additive Runge-Kutta methods.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.function_stages!-Union{Tuple{S}, Tuple{D}, Tuple{VT}, Tuple{TT}, Tuple{DT}, Tuple{ST}, Tuple{Array{ST,1},Array{ST,1},ParametersFLRK{DT,TT,VT,D,S}}} where S where D where VT where TT where DT where ST",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.function_stages!",
    "category": "method",
    "text": "Compute stages of formal Lagrangian Runge-Kutta methods.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.function_stages!-Union{Tuple{ψT}, Tuple{ϕT}, Tuple{FT}, Tuple{VT}, Tuple{TT}, Tuple{DT}, Tuple{Array{DT,1},Array{DT,1},ParametersHSPARK{DT,TT,VT,FT,ϕT,ψT}}} where ψT where ϕT where FT where VT where TT where DT",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.function_stages!",
    "category": "method",
    "text": "Compute stages of Hamiltonian Specialised Partitioned Additive Runge-Kutta methods.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.function_stages!-Union{Tuple{ϕT}, Tuple{GT}, Tuple{UT}, Tuple{PT}, Tuple{FT}, Tuple{TT}, Tuple{DT}, Tuple{Array{DT,1},Array{DT,1},ParametersPARK{DT,TT,FT,PT,UT,GT,ϕT}}} where ϕT where GT where UT where PT where FT where TT where DT",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.function_stages!",
    "category": "method",
    "text": "Compute stages of partitioned additive Runge-Kutta methods.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.function_stages!-Union{Tuple{ϕT}, Tuple{GT}, Tuple{UT}, Tuple{PT}, Tuple{FT}, Tuple{TT}, Tuple{DT}, Tuple{Array{DT,1},Array{DT,1},ParametersSPARK{DT,TT,FT,PT,UT,GT,ϕT}}} where ϕT where GT where UT where PT where FT where TT where DT",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.function_stages!",
    "category": "method",
    "text": "Compute stages of variational special partitioned additive Runge-Kutta methods.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.function_stages!-Union{Tuple{ϕT}, Tuple{GT}, Tuple{UT}, Tuple{PT}, Tuple{FT}, Tuple{TT}, Tuple{DT}, Tuple{Array{DT,1},Array{DT,1},ParametersVPARK{DT,TT,FT,PT,UT,GT,ϕT}}} where ϕT where GT where UT where PT where FT where TT where DT",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.function_stages!",
    "category": "method",
    "text": "Compute stages of variational partitioned additive Runge-Kutta methods.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.initialize!-Tuple{Integrator,Solution,Int64,Int64}",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.initialize!",
    "category": "method",
    "text": "Initialize integrator for initial conditions m with m₁ ≤ m ≤ m₂ and time step 0.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.integrate",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.integrate",
    "category": "function",
    "text": "Integrate ODE specified by vector field and initial condition with given tableau for ntime time steps and return solution.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.integrate",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.integrate",
    "category": "function",
    "text": "Apply integrator for ntime time steps and return solution.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.integrate",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.integrate",
    "category": "function",
    "text": "Integrate given equation with given tableau for ntime time steps and return solution.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.integrate!-Tuple{Integrator,Solution,Any,Any}",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.integrate!",
    "category": "method",
    "text": "Integrate ODE for initial conditions m with m₁ ≤ m ≤ m₂.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.integrate!-Tuple{Integrator,Solution}",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.integrate!",
    "category": "method",
    "text": "Integrate ODE for all initial conditions.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.integrate!-Tuple{IntegratorDIRK,SolutionODE}",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.integrate!",
    "category": "method",
    "text": "Integrate ODE with diagonally implicit Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.integrate!-Tuple{IntegratorDIRK,SolutionPODE}",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.integrate!",
    "category": "method",
    "text": "Integrate partitioned ODE with diagonally implicit Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.integrate!-Tuple{IntegratorGPARK,SolutionPDAE}",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.integrate!",
    "category": "method",
    "text": "Integrate partitioned DAE with Special Additive Runge Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.integrate!-Tuple{IntegratorSIRK,SolutionODE}",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.integrate!",
    "category": "method",
    "text": "Integrate ODE with singly implicit Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.integrate!-Tuple{IntegratorSIRK,SolutionPODE}",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.integrate!",
    "category": "method",
    "text": "Integrate partitioned ODE with singly implicit Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.integrate!-Union{Tuple{N}, Tuple{TT}, Tuple{DT}, Tuple{Integrator{DT,TT},Solution{DT,TT,N},Int64,Int64,Int64,Int64}} where N where TT where DT",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.integrate!",
    "category": "method",
    "text": "Integrate ODE for initial conditions m with m₁ ≤ m ≤ m₂ for time steps n with n₁ ≤ n ≤ n₂.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.integrate!-Union{Tuple{N}, Tuple{VT}, Tuple{GT}, Tuple{FT}, Tuple{ΑT}, Tuple{TT}, Tuple{DT}, Tuple{IntegratorPGLRK{DT,TT,ΑT,FT,GT,VT,ST,IT} where IT where ST,SolutionPDAE{DT,TT,N}}} where N where VT where GT where FT where ΑT where TT where DT",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.integrate!",
    "category": "method",
    "text": "Integrate ODE with variational partitioned Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.readTableauERKFromFile-Tuple{AbstractString,AbstractString}",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.readTableauERKFromFile",
    "category": "method",
    "text": "Read explicit Runge-Kutta tableau from file.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.writeTableauToFile-Union{Tuple{T}, Tuple{AbstractString,AbstractTableauRK{T}}} where T",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.writeTableauToFile",
    "category": "method",
    "text": "Write Runge-Kutta tableau to file.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.AbstractTableauERK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.AbstractTableauERK",
    "category": "type",
    "text": "Holds the tableau of an explicit Runge-Kutta method.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.ParametersCGVI",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.ParametersCGVI",
    "category": "type",
    "text": "ParametersCGVI: Parameters for right-hand side function of continuous Galerkin variational Integrator.\n\nParameters\n\nΘ: function of the noncanonical one-form (∂L/∂v)\nf: function of the force (∂L/∂q)\nΔt: time step\nb: weights of the quadrature rule\nc: nodes of the quadrature rule\nx: nodes of the basis\nm: mass matrix\na: derivative matrix\nr₀: reconstruction coefficients at the beginning of the interval\nr₁: reconstruction coefficients at the end of the interval\nt: current time\nq: current solution of q\np: current solution of p\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.ParametersDGVI",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.ParametersDGVI",
    "category": "type",
    "text": "ParametersDGVI: Parameters for right-hand side function of discontinuous Galerkin variational Integrator.\n\nParameters\n\nΘ: function of the noncanonical one-form (∂L/∂v)\nf: function of the force (∂L/∂q)\nΔt: time step\nb: quadrature weights\nc: quadrature nodes\nm: mass matrix\na: derivative matrix\nr₀: reconstruction coefficients, left-hand side\nr₁: reconstruction coefficients, right-hand side\nβ: weights of the quadrature rule for the flux\nγ: nodes of the quadrature rule for the flux\nμ₀: mass vector for the lhs flux\nμ₁: mass vector for the rhs flux\nα₀: derivative vector for the lhs flux\nα₁: derivative vector for the rhs flux\nt: current time\nq: current solution of q\np: current solution of p\nD: dimension of the system\nS: number of basis nodes\nR: number of quadrature nodes\nP: number of quadrature nodes for the flux\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.ParametersFIRK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.ParametersFIRK",
    "category": "type",
    "text": "Parameters for right-hand side function of fully implicit Runge-Kutta methods.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.ParametersFLRK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.ParametersFLRK",
    "category": "type",
    "text": "Parameters for right-hand side function of formal Lagrangian Runge-Kutta methods.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.ParametersHSPARK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.ParametersHSPARK",
    "category": "type",
    "text": "Parameters for right-hand side function of Hamiltonian Specialised Partitioned Additive Runge-Kutta methods.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.ParametersIPRK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.ParametersIPRK",
    "category": "type",
    "text": "Parameters for right-hand side function of implicit partitioned Runge-Kutta methods.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.ParametersPARK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.ParametersPARK",
    "category": "type",
    "text": "Parameters for right-hand side function of partitioned additive Runge-Kutta methods.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.ParametersPGLRK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.ParametersPGLRK",
    "category": "type",
    "text": "Parameters for right-hand side function of variational partitioned Runge-Kutta methods.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.ParametersSPARK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.ParametersSPARK",
    "category": "type",
    "text": "Parameters for right-hand side function of Specialised Partitioned Additive Runge-Kutta methods.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.ParametersVPARK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.ParametersVPARK",
    "category": "type",
    "text": "Parameters for right-hand side function of variational partitioned additive Runge-Kutta methods.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.ParametersVPRK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.ParametersVPRK",
    "category": "type",
    "text": "Parameters for right-hand side function of variational partitioned Runge-Kutta methods.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.ParametersVPRKpLegendre",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.ParametersVPRKpLegendre",
    "category": "type",
    "text": "Parameters for right-hand side function of variational special partitioned additive Runge-Kutta methods.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.ParametersVPRKpMidpoint",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.ParametersVPRKpMidpoint",
    "category": "type",
    "text": "Parameters for right-hand side function of variational partitioned Runge-Kutta methods.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.ParametersVPRKpSecondary",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.ParametersVPRKpSecondary",
    "category": "type",
    "text": "Parameters for right-hand side function of variational partitioned Runge-Kutta methods.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.ParametersVPRKpStandard",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.ParametersVPRKpStandard",
    "category": "type",
    "text": "Parameters for right-hand side function of variational partitioned Runge-Kutta methods.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.ParametersVPRKpSymmetric",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.ParametersVPRKpSymmetric",
    "category": "type",
    "text": "Parameters for right-hand side function of variational partitioned Runge-Kutta methods.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.ParametersVPRKpVariational",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.ParametersVPRKpVariational",
    "category": "type",
    "text": "Parameters for right-hand side function of variational partitioned Runge-Kutta methods.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.ParametersVSPARK",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.ParametersVSPARK",
    "category": "type",
    "text": "Parameters for right-hand side function of Variational Specialised Partitioned Additive Runge-Kutta methods.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#Base.show-Tuple{IO,CoefficientsARK}",
    "page": "Integrators",
    "title": "Base.show",
    "category": "method",
    "text": "Print additive Runge-Kutta coefficients.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#Base.show-Tuple{IO,CoefficientsMRK}",
    "page": "Integrators",
    "title": "Base.show",
    "category": "method",
    "text": "Print multiplier Runge-Kutta coefficients.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#Base.show-Tuple{IO,CoefficientsPGLRK}",
    "page": "Integrators",
    "title": "Base.show",
    "category": "method",
    "text": "Print Runge-Kutta coefficients.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#Base.show-Tuple{IO,CoefficientsPRK}",
    "page": "Integrators",
    "title": "Base.show",
    "category": "method",
    "text": "Print projective Runge-Kutta coefficients.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#Base.show-Tuple{IO,CoefficientsRK}",
    "page": "Integrators",
    "title": "Base.show",
    "category": "method",
    "text": "Print Runge-Kutta coefficients.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.aitken_neville-Union{Tuple{TT}, Tuple{DT}, Tuple{Array{TT,1},Array{DT,2},TT,Array{DT,1}}} where TT where DT",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.aitken_neville",
    "category": "method",
    "text": "Compute p(x) where p is the unique polynomial of degree length(xi), such that p(x[i]) = y[i]) for all i.\n\nti: interpolation nodes\nxi: interpolation values\nt:  evaluation point\nx:  evaluation value\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.computeStageP!-Tuple{IntegratorEPRK,Int64,Int64,Int64,Any}",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.computeStageP!",
    "category": "method",
    "text": "Compute P stages of explicit partitioned Runge-Kutta methods.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.computeStageQ!-Tuple{IntegratorEPRK,Int64,Int64,Int64,Any}",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.computeStageQ!",
    "category": "method",
    "text": "Compute Q stages of explicit partitioned Runge-Kutta methods.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.create_nonlinear_solver-Tuple{Any,Any,Any}",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.create_nonlinear_solver",
    "category": "method",
    "text": "Create nonlinear solver object for a system of N equations with data type DT. The function f(x)=0 to be solved for is determined by a julia function function_stages!(x, b, params), where x is the current solution and b is the output vector, s.th. b = f(x). params are a set of parameters depending on the equation and integrator that is used. The solver type is obtained from the config dictionary (:nls_solver).\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.create_solution_vector_double_double-Tuple{Any,Any,Any}",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.create_solution_vector_double_double",
    "category": "method",
    "text": "Create a solution vector of type TwicePrecision{DT} for a problem with D dimensions and M independent initial conditions.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.euler_extrapolation-Union{Tuple{TT}, Tuple{DT}, Tuple{Function,TT,TT,Array{DT,1},Array{DT,1},Int64}} where TT where DT",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.euler_extrapolation",
    "category": "method",
    "text": "Euler extrapolation method with arbitrary order p.\n\nv:  function to compute vector field\nt₀: initial time\nt₁: final   time\nx₀: initial value\nx₁: final   value\ns:  number of interpolations (order p=s+1)\n\nTODO This is probably broken!\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.integrate_step!-Union{Tuple{N}, Tuple{FT}, Tuple{TT}, Tuple{DT}, Tuple{IntegratorERK{DT,TT,FT},SolutionODE{DT,TT,N},Int64,Int64}} where N where FT where TT where DT",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.integrate_step!",
    "category": "method",
    "text": "Integrate ODE with explicit Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.integrate_step!-Union{Tuple{N}, Tuple{FT}, Tuple{TT}, Tuple{DT}, Tuple{IntegratorSplitting{DT,TT,FT,ST,FT1,CT,N} where N where CT where FT1 where ST<:AbstractTableauSplitting,SolutionODE{DT,TT,N},Int64,Int64}} where N where FT where TT where DT",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.integrate_step!",
    "category": "method",
    "text": "Integrate ODE with splitting integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.integrate_step!-Union{Tuple{N}, Tuple{FT}, Tuple{VT}, Tuple{TT}, Tuple{DT}, Tuple{IntegratorEPRK{DT,TT,VT,FT},SolutionPODE{DT,TT,N},Int64,Int64}} where N where FT where VT where TT where DT",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.integrate_step!",
    "category": "method",
    "text": "Integrate partitioned ODE with explicit partitioned Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.integrate_step!-Union{Tuple{N}, Tuple{FT}, Tuple{VT}, Tuple{TT}, Tuple{DT}, Tuple{IntegratorIPRK{DT,TT,VT,FT,IT} where IT<:(InitialGuessPODE{DT,TT,VT,FT,IT} where IT<:Interpolator where FT where VT),SolutionPODE{DT,TT,N},Int64,Int64}} where N where FT where VT where TT where DT",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.integrate_step!",
    "category": "method",
    "text": "Integrate ODE with implicit partitioned Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.integrate_step!-Union{Tuple{N}, Tuple{TT}, Tuple{DT}, Tuple{IntegratorFIRK{DT,TT,PT,ST,IT,N} where N where IT<:(InitialGuessODE{DT,TT,VT,IT} where IT<:Interpolator where VT) where ST<:NonlinearSolver{DT} where PT<:(ParametersFIRK{DT,TT,ET,D,S} where S where D where ET<:(ODE{DT,TT,vType,N} where N where vType<:Function)),SolutionODE{DT,TT,N},Int64,Int64}} where N where TT where DT",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.integrate_step!",
    "category": "method",
    "text": "Integrate ODE with fully implicit Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.integrate_step!-Union{Tuple{N}, Tuple{VT}, Tuple{FT}, Tuple{ΘT}, Tuple{TT}, Tuple{DT}, Tuple{IntegratorVPRKpLegendre{DT,TT,ΘT,FT,VT,VT1,SPT,ST,IT} where IT where ST where SPT where VT1,SolutionPDAE{DT,TT,N},Int64,Int64}} where N where VT where FT where ΘT where TT where DT",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.integrate_step!",
    "category": "method",
    "text": "Integrate DAE with variational special partitioned additive Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.integrate_step!-Union{Tuple{N}, Tuple{VT}, Tuple{ϕT}, Tuple{GT}, Tuple{UT}, Tuple{PT}, Tuple{FT}, Tuple{TT}, Tuple{DT}, Tuple{IntegratorSPARK{DT,TT,FT,PT,UT,GT,ϕT,VT,SPT,ST,IT} where IT where ST where SPT,SolutionPDAE{DT,TT,N},Int64,Int64}} where N where VT where ϕT where GT where UT where PT where FT where TT where DT",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.integrate_step!",
    "category": "method",
    "text": "Integrate DAE with variational special partitioned additive Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.integrate_step!-Union{Tuple{N}, Tuple{VT}, Tuple{ϕT}, Tuple{GT}, Tuple{UT}, Tuple{PT}, Tuple{FT}, Tuple{TT}, Tuple{DT}, Tuple{IntegratorVPARK{DT,TT,FT,PT,UT,GT,ϕT,VT,SPT,ST,IT} where IT where ST where SPT,SolutionPDAE{DT,TT,N},Int64,Int64}} where N where VT where ϕT where GT where UT where PT where FT where TT where DT",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.integrate_step!",
    "category": "method",
    "text": "Integrate DAE with variational partitioned additive Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.integrate_step!-Union{Tuple{N}, Tuple{ψT}, Tuple{ϕT}, Tuple{FT}, Tuple{VT}, Tuple{TT}, Tuple{DT}, Tuple{IntegratorHSPARK{DT,TT,VT,FT,ϕT,ψT,SPT,ST,IT} where IT where ST where SPT,SolutionPDAE{DT,TT,N},Int64,Int64}} where N where ψT where ϕT where FT where VT where TT where DT",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.integrate_step!",
    "category": "method",
    "text": "Integrate DAE with variational special partitioned additive Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.integrate_step!-Union{Tuple{N}, Tuple{ϕT}, Tuple{GT}, Tuple{UT}, Tuple{PT}, Tuple{FT}, Tuple{TT}, Tuple{DT}, Tuple{IntegratorPARK{DT,TT,FT,PT,UT,GT,ϕT,ST} where ST,SolutionPDAE{DT,TT,N},Int64,Int64}} where N where ϕT where GT where UT where PT where FT where TT where DT",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.integrate_step!",
    "category": "method",
    "text": "Integrate DAE with partitioned additive Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.integrate_step!-Union{Tuple{TT}, Tuple{DT}, Tuple{IntegratorCGVI{DT,TT,ΘT,FT,GT,VT,FPT,ST,IT,BT,D,S,R} where R where S where D where BT<:Basis where IT where ST where FPT where VT where GT where FT where ΘT,Union{SolutionPDAE{DT,TT,N} where N, SolutionPODE{DT,TT,N} where N},Int64,Int64}} where TT where DT",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.integrate_step!",
    "category": "method",
    "text": "Integrate ODE with variational partitioned Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.integrate_step!-Union{Tuple{TT}, Tuple{DT}, Tuple{IntegratorDGVI{DT,TT,ΘT,FT,GT,VT,FPT,ST,IT,BT,FLT,D,S,R} where R where S where D where FLT<:Flux where BT<:Basis where IT where ST where FPT where VT where GT where FT where ΘT,Union{SolutionPDAE{DT,TT,N} where N, SolutionPODE{DT,TT,N} where N},Int64,Int64}} where TT where DT",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.integrate_step!",
    "category": "method",
    "text": "Integrate ODE with variational partitioned Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.integrate_step!-Union{Tuple{TT}, Tuple{DT}, Tuple{IntegratorFLRK{DT,TT,AT,FT,GT,VT,ΩT,dHT,SPT,ST,IT,N} where N where IT<:(InitialGuessODE{DT,TT,VT,IT} where IT<:Interpolator) where ST where SPT where dHT where ΩT where VT where GT where FT where AT,SolutionPODE{DT,TT,N} where N,Int64,Int64}} where TT where DT",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.integrate_step!",
    "category": "method",
    "text": "Integrate ODE with fully implicit Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.integrate_step!-Union{Tuple{TT}, Tuple{DT}, Tuple{IntegratorVPRKpMidpoint{DT,TT,PT,ST,IT} where IT<:(InitialGuessPODE{DT,TT,VT,FT,IT} where IT<:Interpolator where FT where VT) where ST<:NonlinearSolver{DT} where PT<:(ParametersVPRKpMidpoint{DT,TT,ET,D,S} where S where D where ET<:(IODE{DT,TT,αType,fType,gType,vType,N} where N where vType<:Function where gType<:Function where fType<:Function where αType<:Function)),SolutionPDAE{DT,TT,N} where N,Int64,Int64}} where TT where DT",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.integrate_step!",
    "category": "method",
    "text": "Integrate ODE with variational partitioned Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.integrate_step!-Union{Tuple{TT}, Tuple{DT}, Tuple{IntegratorVPRKpSecondary{DT,TT,PT,ST,IT} where IT<:(InitialGuessPODE{DT,TT,VT,FT,IT} where IT<:Interpolator where FT where VT) where ST<:NonlinearSolver{DT} where PT<:(ParametersVPRKpSecondary{DT,TT,ET,D,S} where S where D where ET<:(VODE{DT,TT,αType,fType,gType,vType,ωType,dHType,N} where N where dHType<:Function where ωType<:Function where vType<:Function where gType<:Function where fType<:Function where αType<:Function)),SolutionPDAE{DT,TT,N} where N,Int64,Int64}} where TT where DT",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.integrate_step!",
    "category": "method",
    "text": "Integrate ODE with variational partitioned Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.integrate_step!-Union{Tuple{TT}, Tuple{DT}, Tuple{IntegratorVPRKpStandard{DT,TT,SPT,PPT,SST,STP,IT} where IT<:(InitialGuessPODE{DT,TT,VT,FT,IT} where IT<:Interpolator where FT where VT) where STP<:NonlinearSolver{DT} where SST<:NonlinearSolver{DT} where PPT<:(ParametersVPRKpStandard{DT,TT,ET,D,S} where S where D where ET<:(IODE{DT,TT,αType,fType,gType,vType,N} where N where vType<:Function where gType<:Function where fType<:Function where αType<:Function)) where SPT<:(ParametersVPRK{DT,TT,ET,D,S} where S where D where ET<:(IODE{DT,TT,αType,fType,gType,vType,N} where N where vType<:Function where gType<:Function where fType<:Function where αType<:Function)),SolutionPDAE{DT,TT,N} where N,Int64,Int64}} where TT where DT",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.integrate_step!",
    "category": "method",
    "text": "Integrate ODE with variational partitioned Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.integrate_step!-Union{Tuple{TT}, Tuple{DT}, Tuple{IntegratorVPRKpSymmetric{DT,TT,PT,ST,IT} where IT<:(InitialGuessPODE{DT,TT,VT,FT,IT} where IT<:Interpolator where FT where VT) where ST<:NonlinearSolver{DT} where PT<:(ParametersVPRKpSymmetric{DT,TT,ET,D,S} where S where D where ET<:(IODE{DT,TT,αType,fType,gType,vType,N} where N where vType<:Function where gType<:Function where fType<:Function where αType<:Function)),SolutionPDAE{DT,TT,N} where N,Int64,Int64}} where TT where DT",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.integrate_step!",
    "category": "method",
    "text": "Integrate ODE with variational partitioned Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.integrate_step!-Union{Tuple{TT}, Tuple{DT}, Tuple{IntegratorVPRKpVariational{DT,TT,SPT,PPT,SST,STP,IT} where IT<:(InitialGuessPODE{DT,TT,VT,FT,IT} where IT<:Interpolator where FT where VT) where STP<:NonlinearSolver{DT} where SST<:NonlinearSolver{DT} where PPT<:(ParametersVPRKpVariational{DT,TT,ET,D,S} where S where D where ET<:(IODE{DT,TT,αType,fType,gType,vType,N} where N where vType<:Function where gType<:Function where fType<:Function where αType<:Function)) where SPT<:(ParametersVPRK{DT,TT,ET,D,S} where S where D where ET<:(IODE{DT,TT,αType,fType,gType,vType,N} where N where vType<:Function where gType<:Function where fType<:Function where αType<:Function)),SolutionPDAE{DT,TT,N} where N,Int64,Int64}} where TT where DT",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.integrate_step!",
    "category": "method",
    "text": "Integrate ODE with variational partitioned Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.integrate_step!-Union{Tuple{TT}, Tuple{DT}, Tuple{IntegratorVPRK{DT,TT,PT,ST,IT} where IT<:(InitialGuessPODE{DT,TT,VT,FT,IT} where IT<:Interpolator where FT where VT) where ST<:NonlinearSolver{DT} where PT<:(ParametersVPRK{DT,TT,ET,D,S} where S where D where ET<:(IODE{DT,TT,αType,fType,gType,vType,N} where N where vType<:Function where gType<:Function where fType<:Function where αType<:Function)),SolutionPDAE{DT,TT,N} where N,Int64,Int64}} where TT where DT",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.integrate_step!",
    "category": "method",
    "text": "Integrate ODE with variational partitioned Runge-Kutta integrator.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.midpoint_extrapolation-Union{Tuple{TT}, Tuple{DT}, Tuple{Function,Function,TT,TT,Array{DT,1},Array{DT,1},Array{DT,1},Array{DT,1},Int64}} where TT where DT",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.midpoint_extrapolation",
    "category": "method",
    "text": "Midpoint extrapolation method with arbitrary order p.\n\nv:  function to compute vector field\nf:  function to compute force  field\nt₀: initial time\nt₁: final   time\nq₀: initial positions\np₀: initial momenta\nq₁: final   positions\np₁: final   momenta\ns:  number of interpolations (order p=2s+2)\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.midpoint_extrapolation-Union{Tuple{TT}, Tuple{DT}, Tuple{Function,TT,TT,Array{DT,1},Array{DT,1},Int64}} where TT where DT",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.midpoint_extrapolation",
    "category": "method",
    "text": "Midpoint extrapolation method with arbitrary order p.\n\nv:  function to compute vector field\nt₀: initial time\nt₁: final   time\nx₀: initial value\nx₁: final   value\ns:  number of interpolations (order p=2s+2)\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#GeometricIntegrators.Integrators.readTableauRKHeaderFromFile-Tuple{Any}",
    "page": "Integrators",
    "title": "GeometricIntegrators.Integrators.readTableauRKHeaderFromFile",
    "category": "method",
    "text": "Reads and parses Tableau metadata from file.\n\n\n\n\n\n"
},

{
    "location": "modules/integrators.html#Integrators-1",
    "page": "Integrators",
    "title": "Integrators",
    "category": "section",
    "text": "Modules = [GeometricIntegrators.Integrators]\nOrder   = [:constant, :type, :macro, :function]"
},

{
    "location": "modules/interpolation.html#",
    "page": "Interpolation",
    "title": "Interpolation",
    "category": "page",
    "text": ""
},

{
    "location": "modules/interpolation.html#GeometricIntegrators.Interpolation.HermiteInterpolation",
    "page": "Interpolation",
    "title": "GeometricIntegrators.Interpolation.HermiteInterpolation",
    "category": "type",
    "text": "Hermite\'s Interpolating Polynomials\n\nHere, we implement a two point Hermite interpolation function which passes through the function and its first derivative for the interval 01. The polynomial is determined by four constraint equations, matching the function and its derivative at the points 0 and 1.\n\nStart by defining the 3rd degree polynomial and its derivative by\n\nbeginalign*\ng(x) = a_0 + a_1 x + a_2 x^2 + a_3 x^3  \ng(x) = a_1 + 2 a_2 x + 3 a_3 x^2 \nendalign*\n\nand apply the constraints\n\nbeginalign*\ng(0) = f_0   Rightarrow  a_0 = f_0  \ng(1) = f_1   Rightarrow  a_0 + a_1 + a_2 + a_3 = f_1  \ng(0) = f_0   Rightarrow  a_1 = f_0  \ng(1) = f_1   Rightarrow  a_1 + 2 a_2 + 3 a_3 = f_1  \nendalign*\n\nSolving for a_0 a_1 a_2 a_3 leads to\n\nbeginalign*\na_0 = f_0  \na_1 = f_0  \na_2 = - 3 f_0 + 3 f_1 - 2 f_0 - f_1  \na_3 = 2 f_0 - 2 f_1 + f_0 + f_1 \nendalign*\n\nso that the polynomial g(x) reads\n\ng(x) = f_0 + f_0 x + (- 3 f_0 + 3 f_1 - 2 f_0 - f_1) x^2 + (2 f_0 - 2 f_1 + f_0 + f_1) x^3 \n\nThe function and derivative values can be factored out, so that g(x) can be rewritten as\n\ng(x) = f_0 (1 - 3 x^2 + 2 x^3) + f_1 (3 x^2 - 2 x^3) + f_0 (x - 2 x^2 + x^3) + f_1 (- x^2 + x^3) \n\nor in generic form as\n\ng(x) = f_0 a_0(x) + f_1 a_1(x) + f_0 b_0(x) + f_1 b_1(x) \n\nwith basis functions\n\nbeginalign*\na_0 (x) = 1 - 3 x^2 + 2 x^3  \nb_0 (x) = x - 2 x^2 + x^3  \na_1 (x) = 3 x^2 - 2 x^3  \nb_1 (x) = - x^2 + x^3 \nendalign*\n\nThe derivative g(x) accordingly reads\n\ng(x) = f_0 a_0(x) + f_1 a_1(x) + f_0 b_0(x) + f_1 b_1(x) \n\nwith\n\nbeginalign*\na_0 (x) = - 6 x + 6 x^2  \nb_0 (x) = 1 - 4 x + 3 x^2  \na_1 (x) = 6 x - 6 x^2  \nb_1 (x) = - 2 x + 3 x^2 \nendalign*\n\nThe basis functions a_0and a_1 are associated with the function values at x_0 and x_1, respectively, while the basis functions b_0 and b_1 are associated with the derivative values at x_0 and x_1. The basis functions satisfy the following relations,\n\nbeginalign*\na_i (x_j) = delta_ij  \nb_i (x_j) = 0  \na_i (x_j) = 0  \nb_i (x_j) = delta_ij  \nij = 0 1 \nendalign*\n\nwhere delta_ij denotes the Kronecker-delta, so that\n\nbeginalign*\ng(0) = f_0  \ng(1) = f_1  \ng(0) = f_0  \ng(1) = f_1 \nendalign*\n\n\n\n\n\n"
},

{
    "location": "modules/interpolation.html#Interpolation-1",
    "page": "Interpolation",
    "title": "Interpolation",
    "category": "section",
    "text": "Modules = [GeometricIntegrators.Interpolation]\nOrder   = [:constant, :type, :macro, :function]"
},

{
    "location": "modules/solvers_linear.html#",
    "page": "Linear Solvers",
    "title": "Linear Solvers",
    "category": "page",
    "text": ""
},

{
    "location": "modules/solvers_linear.html#Linear-Solvers-1",
    "page": "Linear Solvers",
    "title": "Linear Solvers",
    "category": "section",
    "text": "Modules = [GeometricIntegrators.Solvers]\nPages   = [\"solvers/linear/linear_solvers.jl\",\n           \"solvers/linear/lu_solver_lapack.jl\"]\nOrder   = [:constant, :type, :macro, :function]"
},

{
    "location": "modules/solvers_nonlinear.html#",
    "page": "Nonlinear Solvers",
    "title": "Nonlinear Solvers",
    "category": "page",
    "text": ""
},

{
    "location": "modules/solvers_nonlinear.html#Nonlinear-Solvers-1",
    "page": "Nonlinear Solvers",
    "title": "Nonlinear Solvers",
    "category": "section",
    "text": "Modules = [GeometricIntegrators.Solvers]\nPages   = [\"solvers/nonlinear/nonlinear_solvers.jl\",\n           \"solvers/nonlinear/jacobian.jl\",\n           \"solvers/nonlinear/abstract_fixed_point_solver.jl\",\n           \"solvers/nonlinear/fixed_point_solver.jl\",\n           \"solvers/nonlinear/abstract_newton_solver.jl\",\n           \"solvers/nonlinear/newton_solver.jl\",\n           \"solvers/nonlinear/quasi_newton_solver.jl\"]\nOrder   = [:constant, :type, :macro, :function]"
},

{
    "location": "modules/numerical_fluxes.html#",
    "page": "Numerical Fluxes",
    "title": "Numerical Fluxes",
    "category": "page",
    "text": ""
},

{
    "location": "modules/numerical_fluxes.html#GeometricIntegrators.NumericalFluxes.FluxPathLinear",
    "page": "Numerical Fluxes",
    "title": "GeometricIntegrators.NumericalFluxes.FluxPathLinear",
    "category": "type",
    "text": "FluxPathLinear is a linear path\n\nphi (tau q^- q^+) = (1-tau) q^- + tau q^+ \n\n\n\n\n\n"
},

{
    "location": "modules/numerical_fluxes.html#Numerical-Fluxes-1",
    "page": "Numerical Fluxes",
    "title": "Numerical Fluxes",
    "category": "section",
    "text": "Modules = [GeometricIntegrators.NumericalFluxes]\nOrder   = [:constant, :type, :macro, :function]"
},

{
    "location": "modules/quadratures.html#",
    "page": "Quadrature Rules",
    "title": "Quadrature Rules",
    "category": "page",
    "text": ""
},

{
    "location": "modules/quadratures.html#GeometricIntegrators.Quadratures.shift!-Tuple{Any,Any}",
    "page": "Quadrature Rules",
    "title": "GeometricIntegrators.Quadratures.shift!",
    "category": "method",
    "text": "Scale nodes and weights from the interval [-1,+1] to the interval [0,1]\n\n\n\n\n\n"
},

{
    "location": "modules/quadratures.html#Quadratures-1",
    "page": "Quadrature Rules",
    "title": "Quadratures",
    "category": "section",
    "text": "Modules = [GeometricIntegrators.Quadratures]\nOrder   = [:constant, :type, :macro, :function]"
},

{
    "location": "modules/solutions.html#",
    "page": "Solutions",
    "title": "Solutions",
    "category": "page",
    "text": ""
},

{
    "location": "modules/solutions.html#GeometricIntegrators.Solutions.PSolutionPDAE",
    "page": "Solutions",
    "title": "GeometricIntegrators.Solutions.PSolutionPDAE",
    "category": "type",
    "text": "Parallel Solution of a partitioned differential algebraic equation.\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#GeometricIntegrators.Solutions.SSolutionPDAE",
    "page": "Solutions",
    "title": "GeometricIntegrators.Solutions.SSolutionPDAE",
    "category": "type",
    "text": "Serial Solution of a partitioned differential algebraic equation.\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#GeometricIntegrators.Solutions.Solution",
    "page": "Solutions",
    "title": "GeometricIntegrators.Solutions.Solution",
    "category": "type",
    "text": "Create solution for variational ODE.\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#GeometricIntegrators.Solutions.Solution",
    "page": "Solutions",
    "title": "GeometricIntegrators.Solutions.Solution",
    "category": "type",
    "text": "Create solution for implicit DAE.\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#GeometricIntegrators.Solutions.Solution",
    "page": "Solutions",
    "title": "GeometricIntegrators.Solutions.Solution",
    "category": "type",
    "text": "Create solution for SDE.\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#GeometricIntegrators.Solutions.Solution",
    "page": "Solutions",
    "title": "GeometricIntegrators.Solutions.Solution",
    "category": "type",
    "text": "Create solution for partitioned ODE.\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#GeometricIntegrators.Solutions.Solution",
    "page": "Solutions",
    "title": "GeometricIntegrators.Solutions.Solution",
    "category": "type",
    "text": "Create solution for ODE and split ODE.\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#GeometricIntegrators.Solutions.Solution",
    "page": "Solutions",
    "title": "GeometricIntegrators.Solutions.Solution",
    "category": "type",
    "text": "Create solution for implicit ODE.\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#GeometricIntegrators.Solutions.Solution",
    "page": "Solutions",
    "title": "GeometricIntegrators.Solutions.Solution",
    "category": "type",
    "text": "Print error for solutions of equations not implemented, yet.\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#GeometricIntegrators.Solutions.Solution",
    "page": "Solutions",
    "title": "GeometricIntegrators.Solutions.Solution",
    "category": "type",
    "text": "Create solution for DAE.\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#GeometricIntegrators.Solutions.Solution",
    "page": "Solutions",
    "title": "GeometricIntegrators.Solutions.Solution",
    "category": "type",
    "text": "Create solution for partitioned DAE.\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#GeometricIntegrators.Solutions.SolutionDAE",
    "page": "Solutions",
    "title": "GeometricIntegrators.Solutions.SolutionDAE",
    "category": "type",
    "text": "Solution of a differential algebraic equation.\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#GeometricIntegrators.Solutions.SolutionODE",
    "page": "Solutions",
    "title": "GeometricIntegrators.Solutions.SolutionODE",
    "category": "type",
    "text": "SolutionODE: Solution of an ordinary differential equation\n\nContains all fields necessary to store the solution of an ODE.\n\nFields\n\nnd: dimension of the dynamical variable q\nnt: number of time steps to store\nni: number of initial conditions\nt:  time steps\nq:  solution q[nd, nt+1, ni] with q[:,0,:] the initial conditions\nntime: number of time steps to compute\nnsave: save every nsave\'th time step\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#GeometricIntegrators.Solutions.SolutionPODE",
    "page": "Solutions",
    "title": "GeometricIntegrators.Solutions.SolutionPODE",
    "category": "type",
    "text": "Solution of a partitioned ordinary differential equation.\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#GeometricIntegrators.Solutions.SolutionSDE",
    "page": "Solutions",
    "title": "GeometricIntegrators.Solutions.SolutionSDE",
    "category": "type",
    "text": "SolutionSDE: Solution of a stochastic differential equation\n\nContains all fields necessary to store the solution of an SDE.\n\nFields\n\nnd: dimension of the dynamical variable q\nnt: number of time steps to store\nni: number of initial conditions\nt:  time steps\nq:  solution q[nd, nt+1, ni] with q[:,0,:] the initial conditions\nw:  random variable w[1, nt+1, ni]\nntime: number of time steps to compute\nnsave: save every nsave\'th time step\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#GeometricIntegrators.CommonFunctions.write_to_hdf5-Union{Tuple{TT}, Tuple{DT}, Tuple{SolutionDAE{DT,TT,2},HDF5File}, Tuple{SolutionDAE{DT,TT,2},HDF5File,Any}} where TT where DT",
    "page": "Solutions",
    "title": "GeometricIntegrators.CommonFunctions.write_to_hdf5",
    "category": "method",
    "text": "Append solution to HDF5 file.\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#GeometricIntegrators.CommonFunctions.write_to_hdf5-Union{Tuple{TT}, Tuple{DT}, Tuple{SolutionDAE{DT,TT,3},HDF5File}, Tuple{SolutionDAE{DT,TT,3},HDF5File,Any}} where TT where DT",
    "page": "Solutions",
    "title": "GeometricIntegrators.CommonFunctions.write_to_hdf5",
    "category": "method",
    "text": "Append solution to HDF5 file.\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#GeometricIntegrators.CommonFunctions.write_to_hdf5-Union{Tuple{TT}, Tuple{DT}, Tuple{SolutionODE{DT,TT,2},HDF5File}, Tuple{SolutionODE{DT,TT,2},HDF5File,Any}} where TT where DT",
    "page": "Solutions",
    "title": "GeometricIntegrators.CommonFunctions.write_to_hdf5",
    "category": "method",
    "text": "Append solution to HDF5 file.\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#GeometricIntegrators.CommonFunctions.write_to_hdf5-Union{Tuple{TT}, Tuple{DT}, Tuple{SolutionODE{DT,TT,3},HDF5File}, Tuple{SolutionODE{DT,TT,3},HDF5File,Any}} where TT where DT",
    "page": "Solutions",
    "title": "GeometricIntegrators.CommonFunctions.write_to_hdf5",
    "category": "method",
    "text": "Append solution to HDF5 file.\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#GeometricIntegrators.CommonFunctions.write_to_hdf5-Union{Tuple{TT}, Tuple{DT}, Tuple{SolutionPDAE{DT,TT,2},HDF5File}, Tuple{SolutionPDAE{DT,TT,2},HDF5File,Any}} where TT where DT",
    "page": "Solutions",
    "title": "GeometricIntegrators.CommonFunctions.write_to_hdf5",
    "category": "method",
    "text": "Append solution to HDF5 file.\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#GeometricIntegrators.CommonFunctions.write_to_hdf5-Union{Tuple{TT}, Tuple{DT}, Tuple{SolutionPDAE{DT,TT,3},HDF5File}, Tuple{SolutionPDAE{DT,TT,3},HDF5File,Any}} where TT where DT",
    "page": "Solutions",
    "title": "GeometricIntegrators.CommonFunctions.write_to_hdf5",
    "category": "method",
    "text": "Append solution to HDF5 file.\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#GeometricIntegrators.CommonFunctions.write_to_hdf5-Union{Tuple{TT}, Tuple{DT}, Tuple{SolutionPODE{DT,TT,2},HDF5File}, Tuple{SolutionPODE{DT,TT,2},HDF5File,Any}} where TT where DT",
    "page": "Solutions",
    "title": "GeometricIntegrators.CommonFunctions.write_to_hdf5",
    "category": "method",
    "text": "Append solution to HDF5 file.\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#GeometricIntegrators.CommonFunctions.write_to_hdf5-Union{Tuple{TT}, Tuple{DT}, Tuple{SolutionPODE{DT,TT,3},HDF5File}, Tuple{SolutionPODE{DT,TT,3},HDF5File,Any}} where TT where DT",
    "page": "Solutions",
    "title": "GeometricIntegrators.CommonFunctions.write_to_hdf5",
    "category": "method",
    "text": "Append solution to HDF5 file.\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#GeometricIntegrators.CommonFunctions.write_to_hdf5-Union{Tuple{TT}, Tuple{DT}, Tuple{SolutionSDE{DT,TT,2},HDF5File}, Tuple{SolutionSDE{DT,TT,2},HDF5File,Any}} where TT where DT",
    "page": "Solutions",
    "title": "GeometricIntegrators.CommonFunctions.write_to_hdf5",
    "category": "method",
    "text": "Append solution to HDF5 file.\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#GeometricIntegrators.CommonFunctions.write_to_hdf5-Union{Tuple{TT}, Tuple{DT}, Tuple{SolutionSDE{DT,TT,3},HDF5File}, Tuple{SolutionSDE{DT,TT,3},HDF5File,Any}} where TT where DT",
    "page": "Solutions",
    "title": "GeometricIntegrators.CommonFunctions.write_to_hdf5",
    "category": "method",
    "text": "Append solution to HDF5 file.\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#GeometricIntegrators.Solutions.create_hdf5-Union{Tuple{TT}, Tuple{DT}, Tuple{SolutionDAE{DT,TT,2},AbstractString}, Tuple{SolutionDAE{DT,TT,2},AbstractString,Int64}} where TT where DT",
    "page": "Solutions",
    "title": "GeometricIntegrators.Solutions.create_hdf5",
    "category": "method",
    "text": "Creates HDF5 file and initialises datasets for DAE solution object.\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#GeometricIntegrators.Solutions.create_hdf5-Union{Tuple{TT}, Tuple{DT}, Tuple{SolutionDAE{DT,TT,3},AbstractString}, Tuple{SolutionDAE{DT,TT,3},AbstractString,Int64}} where TT where DT",
    "page": "Solutions",
    "title": "GeometricIntegrators.Solutions.create_hdf5",
    "category": "method",
    "text": "Creates HDF5 file and initialises datasets for DAE solution object.\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#GeometricIntegrators.Solutions.create_hdf5-Union{Tuple{TT}, Tuple{DT}, Tuple{SolutionODE{DT,TT,2},AbstractString}, Tuple{SolutionODE{DT,TT,2},AbstractString,Int64}} where TT where DT",
    "page": "Solutions",
    "title": "GeometricIntegrators.Solutions.create_hdf5",
    "category": "method",
    "text": "Creates HDF5 file and initialises datasets for ODE solution object.\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#GeometricIntegrators.Solutions.create_hdf5-Union{Tuple{TT}, Tuple{DT}, Tuple{SolutionODE{DT,TT,3},AbstractString}, Tuple{SolutionODE{DT,TT,3},AbstractString,Int64}} where TT where DT",
    "page": "Solutions",
    "title": "GeometricIntegrators.Solutions.create_hdf5",
    "category": "method",
    "text": "Creates HDF5 file and initialises datasets for ODE solution object.\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#GeometricIntegrators.Solutions.create_hdf5-Union{Tuple{TT}, Tuple{DT}, Tuple{SolutionPDAE{DT,TT,2},AbstractString}} where TT where DT",
    "page": "Solutions",
    "title": "GeometricIntegrators.Solutions.create_hdf5",
    "category": "method",
    "text": "Creates HDF5 file and initialises datasets for PDAE solution object with single initial condition.\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#GeometricIntegrators.Solutions.create_hdf5-Union{Tuple{TT}, Tuple{DT}, Tuple{SolutionPDAE{DT,TT,3},AbstractString}} where TT where DT",
    "page": "Solutions",
    "title": "GeometricIntegrators.Solutions.create_hdf5",
    "category": "method",
    "text": "Creates HDF5 file and initialises datasets for PDAE solution object with multiple initial conditions.\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#GeometricIntegrators.Solutions.create_hdf5-Union{Tuple{TT}, Tuple{DT}, Tuple{SolutionPODE{DT,TT,2},AbstractString}, Tuple{SolutionPODE{DT,TT,2},AbstractString,Int64}} where TT where DT",
    "page": "Solutions",
    "title": "GeometricIntegrators.Solutions.create_hdf5",
    "category": "method",
    "text": "Creates HDF5 file and initialises datasets for PODE solution object.\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#GeometricIntegrators.Solutions.create_hdf5-Union{Tuple{TT}, Tuple{DT}, Tuple{SolutionPODE{DT,TT,3},AbstractString}, Tuple{SolutionPODE{DT,TT,3},AbstractString,Int64}} where TT where DT",
    "page": "Solutions",
    "title": "GeometricIntegrators.Solutions.create_hdf5",
    "category": "method",
    "text": "Creates HDF5 file and initialises datasets for PODE solution object.\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#GeometricIntegrators.Solutions.create_hdf5-Union{Tuple{TT}, Tuple{DT}, Tuple{SolutionSDE{DT,TT,2},AbstractString}, Tuple{SolutionSDE{DT,TT,2},AbstractString,Int64}} where TT where DT",
    "page": "Solutions",
    "title": "GeometricIntegrators.Solutions.create_hdf5",
    "category": "method",
    "text": "Creates HDF5 file and initialises datasets for SDE solution object.\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#GeometricIntegrators.Solutions.create_hdf5-Union{Tuple{TT}, Tuple{DT}, Tuple{SolutionSDE{DT,TT,3},AbstractString}, Tuple{SolutionSDE{DT,TT,3},AbstractString,Int64}} where TT where DT",
    "page": "Solutions",
    "title": "GeometricIntegrators.Solutions.create_hdf5",
    "category": "method",
    "text": "Creates HDF5 file and initialises datasets for SDE solution object.\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#GeometricIntegrators.Solutions.createHDF5",
    "page": "Solutions",
    "title": "GeometricIntegrators.Solutions.createHDF5",
    "category": "function",
    "text": "createHDF5: Creates or opens HDF5 file.\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#GeometricIntegrators.Solutions.writeSolutionToHDF5-Tuple{Solution,AbstractString}",
    "page": "Solutions",
    "title": "GeometricIntegrators.Solutions.writeSolutionToHDF5",
    "category": "method",
    "text": "Creates HDF5 file, writes solution to file, and closes file.\n\n\n\n\n\n"
},

{
    "location": "modules/solutions.html#Solutions-1",
    "page": "Solutions",
    "title": "Solutions",
    "category": "section",
    "text": "Modules = [GeometricIntegrators.Solutions]\nOrder   = [:constant, :type, :macro, :function]"
},

{
    "location": "modules/tableaus.html#",
    "page": "Tableaus",
    "title": "Tableaus",
    "category": "page",
    "text": ""
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauERK4-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauERK4",
    "category": "method",
    "text": "Tableau for explicit Runge-Kutta method of order four (1/6 rule)\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauERK438-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauERK438",
    "category": "method",
    "text": "Tableau for explicit Runge-Kutta method of order four (3/8 rule)\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauExplicitEuler-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauExplicitEuler",
    "category": "method",
    "text": "Tableau for explicit Euler method\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauExplicitMidpoint-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauExplicitMidpoint",
    "category": "method",
    "text": "Tableau for explicit midpoint method\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauGLRKpSymmetric-Tuple{Any}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauGLRKpSymmetric",
    "category": "method",
    "text": "Tableau for Gauss-Legendre method with s stages and symplectic projection.\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauGLRKpSymplectic-Tuple{Any}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauGLRKpSymplectic",
    "category": "method",
    "text": "Tableau for Gauss-Legendre method with s stages and symplectic projection.\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauHeun-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauHeun",
    "category": "method",
    "text": "Tableau for Heun\'s method\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauImplicitEuler-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauImplicitEuler",
    "category": "method",
    "text": "Implicit Euler\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauImplicitMidpoint-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauImplicitMidpoint",
    "category": "method",
    "text": "Implicit Midpoint\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauKutta-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauKutta",
    "category": "method",
    "text": "Tableau for Kutta\'s method of order three\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauLobIIIA2-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauLobIIIA2",
    "category": "method",
    "text": "Gauss-Lobatto-IIIA Runge-Kutta, s=2\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauLobIIIA3-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauLobIIIA3",
    "category": "method",
    "text": "Gauss-Lobatto-IIIA Runge-Kutta, s=3\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauLobIIIA4-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauLobIIIA4",
    "category": "method",
    "text": "Gauss-Lobatto-IIIA Runge-Kutta, s=4\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauLobIIIAIIIB2pSymmetric-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauLobIIIAIIIB2pSymmetric",
    "category": "method",
    "text": "Tableau for Gauss-Lobatto IIIA-IIIB method with two stages and symmetric projection.\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauLobIIIAIIIB2pSymplectic-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauLobIIIAIIIB2pSymplectic",
    "category": "method",
    "text": "Tableau for Gauss-Lobatto IIIA-IIIB method with two stages and symplectic projection.\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauLobIIIAIIIB3pSymmetric-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauLobIIIAIIIB3pSymmetric",
    "category": "method",
    "text": "Tableau for Gauss-Lobatto IIIA-IIIB method with three stages and symmetric projection.\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauLobIIIAIIIB3pSymplectic-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauLobIIIAIIIB3pSymplectic",
    "category": "method",
    "text": "Tableau for Gauss-Lobatto IIIA-IIIB method with three stages and symplectic projection.\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauLobIIIB2-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauLobIIIB2",
    "category": "method",
    "text": "Gauss-Lobatto-IIIB Runge-Kutta, s=2\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauLobIIIB3-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauLobIIIB3",
    "category": "method",
    "text": "Gauss-Lobatto-IIIB Runge-Kutta, s=3\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauLobIIIB4-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauLobIIIB4",
    "category": "method",
    "text": "Gauss-Lobatto-IIIB Runge-Kutta, s=4\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauLobIIIC2-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauLobIIIC2",
    "category": "method",
    "text": "Gauss-Lobatto-IIIC Runge-Kutta, s=2\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauLobIIIC3-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauLobIIIC3",
    "category": "method",
    "text": "Gauss-Lobatto-IIIC Runge-Kutta, s=3\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauLobIIIC4-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauLobIIIC4",
    "category": "method",
    "text": "Gauss-Lobatto-IIIC Runge-Kutta, s=4\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauLobIIID2-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauLobIIID2",
    "category": "method",
    "text": "Gauss-Lobatto-IIID Runge-Kutta, s=2\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauLobIIID3-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauLobIIID3",
    "category": "method",
    "text": "Gauss-Lobatto-IIID Runge-Kutta, s=3\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauLobIIID4-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauLobIIID4",
    "category": "method",
    "text": "Gauss-Lobatto-IIID Runge-Kutta, s=4\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauLobIIIE2-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauLobIIIE2",
    "category": "method",
    "text": "Gauss-Lobatto-IIIE Runge-Kutta, s=2\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauLobIIIE3-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauLobIIIE3",
    "category": "method",
    "text": "Gauss-Lobatto-IIIE Runge-Kutta, s=3\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauLobIIIE4-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauLobIIIE4",
    "category": "method",
    "text": "Gauss-Lobatto-IIIE Runge-Kutta, s=4\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauLobIIIF2-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauLobIIIF2",
    "category": "method",
    "text": "Gauss-Lobatto-IIIF Runge-Kutta, s=2\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauLobIIIF3-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauLobIIIF3",
    "category": "method",
    "text": "Gauss-Lobatto-IIIF Runge-Kutta, s=3\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauLobIIIF4-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauLobIIIF4",
    "category": "method",
    "text": "Gauss-Lobatto-IIIF Runge-Kutta, s=4\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauLobIIIG2-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauLobIIIG2",
    "category": "method",
    "text": "Gauss-Lobatto-IIIG Runge-Kutta, s=2\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauLobIIIG3-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauLobIIIG3",
    "category": "method",
    "text": "Gauss-Lobatto-IIIG Runge-Kutta, s=3\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauLobIIIG4-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauLobIIIG4",
    "category": "method",
    "text": "Gauss-Lobatto-IIIG Runge-Kutta, s=4\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauLobattoIIIAIIIB2-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauLobattoIIIAIIIB2",
    "category": "method",
    "text": "Tableau for Gauss-Lobatto IIIAIIIB method with s=2 stages\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauLobattoIIIBIIIA2-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauLobattoIIIBIIIA2",
    "category": "method",
    "text": "Tableau for Gauss-Lobatto IIIBIIIA method with s=2 stages\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauRadIIA2-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauRadIIA2",
    "category": "method",
    "text": "Gauss-Radau-IIA Runge-Kutta, s=2\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauRadIIA3-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauRadIIA3",
    "category": "method",
    "text": "Gauss-Radau-IIA Runge-Kutta, s=3\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauSRK3-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauSRK3",
    "category": "method",
    "text": "Gauss-Legendre Runge-Kutta, s=3\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauSymplecticEulerA-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauSymplecticEulerA",
    "category": "method",
    "text": "Tableau for symplectic Euler-A method\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauSymplecticEulerB-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauSymplecticEulerB",
    "category": "method",
    "text": "Tableau for symplectic Euler-B method\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauVPGLRK-Tuple{Any}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauVPGLRK",
    "category": "method",
    "text": "Tableau for variational Gauss-Legendre method with s stages\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauVPLobIIIA2-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauVPLobIIIA2",
    "category": "method",
    "text": "Tableau for variational Gauss-Lobatto IIIA-IIIB method with two stages\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauVPLobIIIA3-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauVPLobIIIA3",
    "category": "method",
    "text": "Tableau for variational Gauss-Lobatto IIIA-IIIB method with three stages\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauVPLobIIIA4-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauVPLobIIIA4",
    "category": "method",
    "text": "Tableau for variational Gauss-Lobatto IIIA-IIIB method with four stages\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauVPLobIIIAIIIA2-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauVPLobIIIAIIIA2",
    "category": "method",
    "text": "Tableau for Gauss-Lobatto IIIA-IIIA method with two stages\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauVPLobIIIAIIIA3-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauVPLobIIIAIIIA3",
    "category": "method",
    "text": "Tableau for Gauss-Lobatto IIIA-IIIA method with three stages\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauVPLobIIIAIIIA4-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauVPLobIIIAIIIA4",
    "category": "method",
    "text": "Tableau for Gauss-Lobatto IIIA-IIIA method with four stages\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauVPLobIIIB2-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauVPLobIIIB2",
    "category": "method",
    "text": "Tableau for variational Gauss-Lobatto IIIA-IIIB method with two stages\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauVPLobIIIB3-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauVPLobIIIB3",
    "category": "method",
    "text": "Tableau for variational Gauss-Lobatto IIIA-IIIB method with three stages\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauVPLobIIIB4-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauVPLobIIIB4",
    "category": "method",
    "text": "Tableau for variational Gauss-Lobatto IIIA-IIIB method with four stages\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauVPLobIIIC2-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauVPLobIIIC2",
    "category": "method",
    "text": "Tableau for variational Gauss-Lobatto IIIC-III method with two stages\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauVPLobIIIC3-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauVPLobIIIC3",
    "category": "method",
    "text": "Tableau for variational Gauss-Lobatto IIIC-III method with three stages\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauVPLobIIIC4-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauVPLobIIIC4",
    "category": "method",
    "text": "Tableau for variational Gauss-Lobatto IIIC-III method with four stages\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauVPLobIIID2-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauVPLobIIID2",
    "category": "method",
    "text": "Tableau for variational Gauss-Lobatto IIID method with two stages\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauVPLobIIID3-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauVPLobIIID3",
    "category": "method",
    "text": "Tableau for variational Gauss-Lobatto IIID method with three stages\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauVPLobIIID4-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauVPLobIIID4",
    "category": "method",
    "text": "Tableau for variational Gauss-Lobatto IIID method with four stages\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauVPLobIIIE2-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauVPLobIIIE2",
    "category": "method",
    "text": "Tableau for variational Gauss-Lobatto IIIE method with two stages\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauVPLobIIIE3-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauVPLobIIIE3",
    "category": "method",
    "text": "Tableau for variational Gauss-Lobatto IIIE method with three stages\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauVPLobIIIE4-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauVPLobIIIE4",
    "category": "method",
    "text": "Tableau for variational Gauss-Lobatto IIIE method with four stages\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauVPLobIIIF2-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauVPLobIIIF2",
    "category": "method",
    "text": "Tableau for variational Gauss-Lobatto IIIF method with two stages\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauVPLobIIIF3-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauVPLobIIIF3",
    "category": "method",
    "text": "Tableau for variational Gauss-Lobatto IIIF method with three stages\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauVPLobIIIF4-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauVPLobIIIF4",
    "category": "method",
    "text": "Tableau for variational Gauss-Lobatto IIIF method with four stages\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauVPLobIIIG2-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauVPLobIIIG2",
    "category": "method",
    "text": "Tableau for variational Gauss-Lobatto IIIG method with two stages\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauVPLobIIIG3-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauVPLobIIIG3",
    "category": "method",
    "text": "Tableau for variational Gauss-Lobatto IIIG method with three stages\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauVPLobIIIG4-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauVPLobIIIG4",
    "category": "method",
    "text": "Tableau for variational Gauss-Lobatto IIIG method with four stages\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauVPRadIIAIIA2-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauVPRadIIAIIA2",
    "category": "method",
    "text": "Tableau for Gauss-Radau IIA-IIA method with two stages\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauVPRadIIAIIA3-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauVPRadIIAIIA3",
    "category": "method",
    "text": "Tableau for Gauss-Radau IIA-IIA method with three stages\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#GeometricIntegrators.Tableaus.getTableauVPSRK3-Tuple{}",
    "page": "Tableaus",
    "title": "GeometricIntegrators.Tableaus.getTableauVPSRK3",
    "category": "method",
    "text": "Tableau for variational symmetric Runge-Kutta method with 3 stages\n\n\n\n\n\n"
},

{
    "location": "modules/tableaus.html#Tableaus-1",
    "page": "Tableaus",
    "title": "Tableaus",
    "category": "section",
    "text": "Modules = [GeometricIntegrators.Tableaus]\nOrder   = [:constant, :type, :macro, :function]"
},

]}
