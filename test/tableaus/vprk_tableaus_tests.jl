
@testset "$(rpad("Variational Partitioned Runge-Kutta Tableaus",80))" begin

    @test typeof(TableauVPGLRK(1)) <: TableauVPRK
    @test typeof(TableauVPGLRK(2)) <: TableauVPRK
    @test typeof(TableauVPGLRK(3)) <: TableauVPRK
    @test typeof(TableauVPGLRK(4)) <: TableauVPRK

    @test typeof(TableauVPSRK3()) <: TableauVPRK

    @test typeof(TableauVPLobattoIIIA(2)) <: TableauVPRK
    @test typeof(TableauVPLobattoIIIA(3)) <: TableauVPRK
    @test typeof(TableauVPLobattoIIIA(4)) <: TableauVPRK
    @test typeof(TableauVPLobattoIIIA(5)) <: TableauVPRK

    @test typeof(TableauVPLobattoIIIB(2)) <: TableauVPRK
    @test typeof(TableauVPLobattoIIIB(3)) <: TableauVPRK
    @test typeof(TableauVPLobattoIIIB(4)) <: TableauVPRK
    @test typeof(TableauVPLobattoIIIB(5)) <: TableauVPRK

    @test typeof(TableauVPLobattoIIIC(2)) <: TableauVPRK
    @test typeof(TableauVPLobattoIIIC(3)) <: TableauVPRK
    @test typeof(TableauVPLobattoIIIC(4)) <: TableauVPRK
    @test typeof(TableauVPLobattoIIIC(5)) <: TableauVPRK

    @test typeof(TableauVPLobattoIIIC̄(2)) <: TableauVPRK
    @test typeof(TableauVPLobattoIIIC̄(3)) <: TableauVPRK
    @test typeof(TableauVPLobattoIIIC̄(4)) <: TableauVPRK
    @test typeof(TableauVPLobattoIIIC̄(5)) <: TableauVPRK

    @test typeof(TableauVPLobattoIIID(2)) <: TableauVPRK
    @test typeof(TableauVPLobattoIIID(3)) <: TableauVPRK
    @test typeof(TableauVPLobattoIIID(4)) <: TableauVPRK
    @test typeof(TableauVPLobattoIIID(5)) <: TableauVPRK

    @test typeof(TableauVPLobattoIIIE(2)) <: TableauVPRK
    @test typeof(TableauVPLobattoIIIE(3)) <: TableauVPRK
    @test typeof(TableauVPLobattoIIIE(4)) <: TableauVPRK
    @test typeof(TableauVPLobattoIIIE(5)) <: TableauVPRK

    @test typeof(TableauVPLobattoIIIF(2)) <: TableauVPRK
    @test typeof(TableauVPLobattoIIIF(3)) <: TableauVPRK
    @test typeof(TableauVPLobattoIIIF(4)) <: TableauVPRK
    @test typeof(TableauVPLobattoIIIF(5)) <: TableauVPRK

    @test typeof(TableauVPLobattoIIIG(2)) <: TableauVPRK
    @test typeof(TableauVPLobattoIIIG(3)) <: TableauVPRK
    @test typeof(TableauVPLobattoIIIG(4)) <: TableauVPRK
    @test typeof(TableauVPLobattoIIIG(5)) <: TableauVPRK

    @test typeof(TableauVPLobattoIIIAIIIA(2)) <: TableauVPRK
    @test typeof(TableauVPLobattoIIIAIIIA(3)) <: TableauVPRK
    @test typeof(TableauVPLobattoIIIAIIIA(4)) <: TableauVPRK
    @test typeof(TableauVPLobattoIIIAIIIA(5)) <: TableauVPRK

    @test typeof(TableauVPLobattoIIIBIIIB(2)) <: TableauVPRK
    @test typeof(TableauVPLobattoIIIBIIIB(3)) <: TableauVPRK
    @test typeof(TableauVPLobattoIIIBIIIB(4)) <: TableauVPRK
    @test typeof(TableauVPLobattoIIIBIIIB(5)) <: TableauVPRK

    @test typeof(TableauVPRadauIIAIIA(2)) <: TableauVPRK
    @test typeof(TableauVPRadauIIAIIA(3)) <: TableauVPRK
    @test typeof(TableauVPRadauIIAIIA(4)) <: TableauVPRK
    @test typeof(TableauVPRadauIIAIIA(5)) <: TableauVPRK


    @test TableauVPGLRK(1) == TableauVPGLRK(Float64, 1)
    @test TableauVPSRK3()  == TableauVPSRK3(Float64)

    @test TableauVPLobattoIIIA(2) == TableauVPLobattoIIIA(Float64, 2)
    @test TableauVPLobattoIIIB(2) == TableauVPLobattoIIIB(Float64, 2)
    @test TableauVPLobattoIIIC(2) == TableauVPLobattoIIIC(Float64, 2)
    @test TableauVPLobattoIIIC̄(2) == TableauVPLobattoIIIC̄(Float64, 2)
    @test TableauVPLobattoIIID(2) == TableauVPLobattoIIID(Float64, 2)
    @test TableauVPLobattoIIIE(2) == TableauVPLobattoIIIE(Float64, 2)
    @test TableauVPLobattoIIIF(2) == TableauVPLobattoIIIF(Float64, 2)
    @test TableauVPLobattoIIIF(2) == TableauVPLobattoIIIF(Float64, 2)
    @test TableauVPLobattoIIIG(2) == TableauVPLobattoIIIG(Float64, 2)
    @test TableauVPRadauIIAIIA(2) == TableauVPRadauIIAIIA(Float64, 2)

end
